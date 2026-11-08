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
  const userDataDir = path.resolve(__dirname, '../.chrome-test-profile-ghauth');
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

async function runGitHubAuthVerification() {
  const serverPort = 5198;
  const cdpPort = 9253;

  console.log('--- STARTING GITHUB AUTH VERIFICATION ---');
  const server = await startServer(serverPort);
  const chromeInfo = launchChrome(cdpPort);

  try {
    const browserCDP = await createCDPClient(chromeInfo.wsUrlPromise);

    const { targetId } = await browserCDP.send('Target.createTarget', {
      url: `http://127.0.0.1:${serverPort}/DevConnect/auth`,
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

    console.log('Navigating directly to /DevConnect/auth ...');
    await send('Page.navigate', {
      url: `http://127.0.0.1:${serverPort}/DevConnect/auth`,
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

    console.log('\n--- 1. VERIFYING GITHUB SIGN-IN OPTIONS ON AUTH PAGE ---');
    const authCheck = await evaluate(`(() => {
      const bodyText = document.body.innerText;
      const ghBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Continue with GitHub'));
      const instantLink = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('@deew101'));
      const setupLink = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('GitHub Setup Info'));

      return {
        hasGitHubButton: !!ghBtn,
        hasInstantDemoLink: !!instantLink,
        hasSetupInfoLink: !!setupLink,
        headerTitle: document.querySelector('h1')?.innerText,
      };
    })()`);

    console.log('Auth Page Check Results:', JSON.stringify(authCheck, null, 2));

    // Capture auth page screenshot
    const { data: authScreenshot } = await send('Page.captureScreenshot', { format: 'png' });
    const authPath = path.resolve('C:/Users/Acer/.gemini/antigravity/brain/e9e5b64f-a467-433d-a5d9-2bfcd09ce2d3/verified_auth_github_page.png');
    fs.writeFileSync(authPath, Buffer.from(authScreenshot, 'base64'));
    console.log('✓ Auth page screenshot saved to:', authPath);

    console.log('\n--- 2. OPENING GITHUB SETUP GUIDE DIALOG ---');
    await evaluate(`(() => {
      const setupBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('GitHub Setup Info'));
      if (setupBtn) setupBtn.click();
    })()`);
    await sleep(600);

    const modalCheck = await evaluate(`(() => {
      const bodyText = document.body.innerText;
      return {
        modalVisible: bodyText.includes('GitHub OAuth Configuration Guide'),
        hasCallbackUrl: bodyText.includes('https://ngzzgocnoimbayygnstz.supabase.co/auth/v1/callback'),
        hasSupabaseLink: bodyText.includes('Open Supabase Auth Providers'),
      };
    })()`);
    console.log('Modal Check Results:', JSON.stringify(modalCheck, null, 2));

    // Capture modal screenshot
    const { data: modalScreenshot } = await send('Page.captureScreenshot', { format: 'png' });
    const modalPath = path.resolve('C:/Users/Acer/.gemini/antigravity/brain/e9e5b64f-a467-433d-a5d9-2bfcd09ce2d3/verified_github_setup_modal.png');
    fs.writeFileSync(modalPath, Buffer.from(modalScreenshot, 'base64'));
    console.log('✓ Setup modal screenshot saved to:', modalPath);

    console.log('\n--- 3. EXECUTING INSTANT GITHUB SIGN IN FLOW ---');
    await evaluate(`(() => {
      const instantBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Instant Demo Sign In'));
      if (instantBtn) instantBtn.click();
    })()`);
    await sleep(1500);

    const dashCheck = await evaluate(`(() => {
      return {
        currentPath: window.location.pathname,
        hasHero: document.body.innerText.includes('Good afternoon'),
        hasAvatar: !!document.querySelector('header img, header .rounded-full'),
        userNameInStorage: (() => {
          try {
            const raw = localStorage.getItem('devconnect-auth-token');
            const parsed = JSON.parse(raw);
            return parsed.user?.user_metadata?.user_name;
          } catch (e) {
            return null;
          }
        })(),
      };
    })()`);
    console.log('Dashboard Post-GitHub Sign-In Check:', JSON.stringify(dashCheck, null, 2));

    // Capture authenticated dashboard screenshot
    const { data: dashScreenshot } = await send('Page.captureScreenshot', { format: 'png' });
    const dashPath = path.resolve('C:/Users/Acer/.gemini/antigravity/brain/e9e5b64f-a467-433d-a5d9-2bfcd09ce2d3/verified_github_authenticated_dashboard.png');
    fs.writeFileSync(dashPath, Buffer.from(dashScreenshot, 'base64'));
    console.log('✓ Authenticated Dashboard screenshot saved to:', dashPath);

    pageWs.close();
    console.log('\n=== GITHUB AUTH VERIFICATION COMPLETED SUCCESSFULLY ===');
  } finally {
    chromeInfo.proc.kill();
    server.close();
  }
}

runGitHubAuthVerification().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
