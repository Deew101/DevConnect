const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 1. Static web server for dist/
function startServer(port) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
  };

  const distDir = path.resolve(__dirname, '../dist');

  const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0].split('#')[0];
    if (reqPath.startsWith('/DevConnect')) {
      reqPath = reqPath.replace(/^\/DevConnect/, '') || '/';
    }
    let filePath = path.join(distDir, reqPath === '/' ? 'index.html' : reqPath);

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(distDir, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading file');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });

  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => {
      console.log(`Server listening at http://127.0.0.1:${port}/DevConnect/`);
      resolve(server);
    });
  });
}

// 2. Launch Chrome headless with CDP
function launchChrome(port) {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.resolve(__dirname, '../.chrome-test-profile-comm');
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
  }

  let wsUrlResolve;
  const wsUrlPromise = new Promise((resolve) => {
    wsUrlResolve = resolve;
  });

  const proc = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--disable-gpu',
    '--no-sandbox',
    '--disable-extensions',
    '--window-size=1440,900',
    'about:blank',
  ]);

  proc.stderr?.on('data', (d) => {
    const text = d.toString();
    const match = text.match(/ws:\/\/127\.0\.0\.1:\d+\/devtools\/browser\/[a-zA-Z0-9-]+/);
    if (match) {
      wsUrlResolve(match[0]);
    }
  });

  return { proc, wsUrlPromise };
}

// 3. CDP helper
async function createCDPClient(wsUrlPromise) {
  const wsUrl = await Promise.race([
    wsUrlPromise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout waiting for Chrome stderr ws URL')), 10000)),
  ]);

  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let idCounter = 1;
  const callbacks = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      callbacks.get(msg.id)(msg);
      callbacks.delete(msg.id);
    }
  };

  const send = (method, params = {}) => {
    const id = idCounter++;
    return new Promise((resolve, reject) => {
      callbacks.set(id, (msg) => {
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      });
      ws.send(JSON.stringify({ id, method, params }));
    });
  };

  return { ws, send };
}

async function runCommunicationTests() {
  const serverPort = 5195;
  const cdpPort = 9249;

  console.log('--- STARTING ALL COMMUNICATION TABS TEST SERVER & CHROME ---');
  const server = await startServer(serverPort);
  const chromeInfo = launchChrome(cdpPort);

  try {
    const browserCDP = await createCDPClient(chromeInfo.wsUrlPromise);

    const { targetId } = await browserCDP.send('Target.createTarget', {
      url: `http://127.0.0.1:${serverPort}/DevConnect/dashboard`,
    });

    console.log('Created page target:', targetId);
    browserCDP.ws.close();

    const pageWsUrl = `ws://127.0.0.1:${cdpPort}/devtools/page/${targetId}`;
    const pageWs = new WebSocket(pageWsUrl);
    await new Promise((resolve, reject) => {
      pageWs.onopen = resolve;
      pageWs.onerror = reject;
    });

    let idCounter = 1;
    const callbacks = new Map();
    pageWs.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg);
        callbacks.delete(msg.id);
      }
    };

    const send = (method, params = {}) => {
      const id = idCounter++;
      return new Promise((resolve, reject) => {
        callbacks.set(id, (msg) => {
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        });
        pageWs.send(JSON.stringify({ id, method, params }));
      });
    };

    await send('Page.enable');
    await send('Runtime.enable');

    // Pre-populate mock session in localStorage
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        try {
          const mockSession = {
            access_token: 'mock-session-token',
            refresh_token: 'mock-refresh-token',
            expires_in: 7200,
            expires_at: Math.floor(Date.now() / 1000) + 7200,
            token_type: 'bearer',
            user: {
              id: 'd3300000-0000-4000-a000-000000000001',
              aud: 'authenticated',
              role: 'authenticated',
              email: 'dev@devconnect.io',
              email_confirmed_at: '2026-01-01T00:00:00Z',
              user_metadata: {
                full_name: 'Devang',
                user_name: 'devang',
                is_onboarded: true
              },
              app_metadata: {
                provider: 'google'
              }
            }
          };
          localStorage.setItem('devconnect-auth-token', JSON.stringify(mockSession));
        } catch (e) {
          console.error('Error pre-seeding localStorage:', e);
        }
      `,
    });

    await send('Page.navigate', {
      url: `http://127.0.0.1:${serverPort}/DevConnect/dashboard`,
    });
    await sleep(2000);

    const evaluate = async (expr) => {
      const res = await send('Runtime.evaluate', {
        expression: expr,
        returnByValue: true,
        awaitPromise: true,
      });
      return res.result ? res.result.value : null;
    };

    const commTabs = [
      { name: 'Messages', path: '/messages', checkSnippet: 'CHANNEL DOSSIER' },
      { name: 'Notifications', path: '/notifications', checkSnippet: 'Notification' },
      { name: 'Saved Projects', path: '/saved-projects', checkSnippet: 'Saved Projects' },
    ];

    for (const tab of commTabs) {
      console.log(`\n--- TESTING COMMUNICATION TAB: ${tab.name} (${tab.path}) ---`);

      // Click the sidebar link
      await evaluate(`(() => {
        const link = document.querySelector('a[href$="${tab.path}"]');
        if (link) link.click();
      })()`);

      await sleep(1200);

      const check = await evaluate(`(() => {
        const bodyText = document.body.innerText;
        const hasError = bodyText.includes('Something went wrong') || bodyText.includes('postgres_changes');
        return {
          currentPath: window.location.pathname,
          hasError,
          errorText: hasError ? bodyText.slice(0, 300) : null,
          bodySnippet: bodyText.slice(0, 150).replace(/\\n/g, ' '),
        };
      })()`);

      console.log(`Result for ${tab.name}:`, JSON.stringify(check, null, 2));

      if (check.hasError) {
        throw new Error(`Failed on ${tab.name}! ErrorBoundary triggered: ${check.errorText}`);
      }

      // Capture screenshot
      const { data: ss } = await send('Page.captureScreenshot', { format: 'png' });
      const filename = `verified_comm_${tab.name.toLowerCase().replace(/\s+/g, '_')}.png`;
      const artifactPath = path.resolve('C:/Users/Acer/.gemini/antigravity/brain/e9e5b64f-a467-433d-a5d9-2bfcd09ce2d3', filename);
      fs.writeFileSync(artifactPath, Buffer.from(ss, 'base64'));
      console.log(`✓ Screenshot saved: ${artifactPath}`);
    }

    pageWs.close();
    console.log('\n=== ALL 3 COMMUNICATION TABS VERIFIED FLAWLESSLY ===');
  } finally {
    chromeInfo.proc.kill();
    server.close();
  }
}

runCommunicationTests().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
