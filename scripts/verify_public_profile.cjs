const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

function launchChrome(port) {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.resolve(__dirname, '../.chrome-test-profile-publicview');
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

async function runPublicProfileVerification() {
  const serverPort = 5199;
  const cdpPort = 9255;

  console.log('--- STARTING PUBLIC PROFILE VERIFICATION ---');
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
    await send('DOM.enable');

    console.log('Navigating to Auth page to authenticate...');
    await send('Page.navigate', { url: `http://127.0.0.1:${serverPort}/DevConnect/auth` });
    await sleep(2000);

    // Sign in using the instant demo GitHub user
    console.log('Clicking Instant Demo Sign In button...');
    const clickDemo = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b =>
            b.innerText.includes('Verified GitHub Engineer') || b.innerText.includes('Instant Demo')
          );
          if (btn) {
            btn.click();
            return { clicked: true, text: btn.innerText.trim() };
          }
          return { clicked: false, allButtons: Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()) };
        })()
      `,
      returnByValue: true,
    });
    console.log('Instant Demo Sign In click:', clickDemo.result.value);
    await sleep(2500);

    console.log('Checking current URL after sign in...');
    const urlCheck = await send('Runtime.evaluate', { expression: 'window.location.href', returnByValue: true });
    console.log('Current URL:', urlCheck.result.value);

    // Navigate to /DevConnect/profile/me (the exact route navigated by clicking Public Profile)
    console.log('Navigating to /DevConnect/profile/me...');
    await send('Page.navigate', { url: `http://127.0.0.1:${serverPort}/DevConnect/profile/me` });
    await sleep(2500);

    // 3. Inspect the profile page state
    const profileVerification = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const url = window.location.href;
          const bodyText = document.body.innerText;
          const hasRecordNotFound = bodyText.includes('Record Not Found');
          const fullName = document.querySelector('h1')?.textContent?.trim() || '';
          const hasDossier = bodyText.includes('ENGINEER PROFILE') || bodyText.includes('Share Dossier');
          const hasEditProfile = bodyText.includes('Edit Profile');
          const hasSkills = bodyText.includes('Technical Skills') || bodyText.includes('React') || bodyText.includes('TypeScript');
          const hasProjects = bodyText.includes('Project Portfolio');
          const hasRepos = bodyText.includes('GitHub Repositories');

          return {
            url,
            hasRecordNotFound,
            fullName,
            hasDossier,
            hasEditProfile,
            hasSkills,
            hasProjects,
            hasRepos
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('Profile Verification (/profile/me):', JSON.stringify(profileVerification.result.value, null, 2));

    // 4. Capture screenshot
    const screenshotData = await send('Page.captureScreenshot', { format: 'png' });
    const artifactDir = 'C:\\Users\\Acer\\.gemini\\antigravity\\brain\\e9e5b64f-a467-433d-a5d9-2bfcd09ce2d3';
    const screenshotPath = path.join(artifactDir, 'verified_public_profile_restored.png');
    fs.writeFileSync(screenshotPath, Buffer.from(screenshotData.data, 'base64'));
    console.log('Saved screenshot to:', screenshotPath);

    // 5. Test direct URL /profile/deew101
    console.log('Navigating directly to /DevConnect/profile/deew101...');
    await send('Page.navigate', { url: `http://127.0.0.1:${serverPort}/DevConnect/profile/deew101` });
    await sleep(2000);

    const deewProfileVerification = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const url = window.location.href;
          const bodyText = document.body.innerText;
          const hasRecordNotFound = bodyText.includes('Record Not Found');
          const fullName = document.querySelector('h1')?.textContent?.trim() || '';
          return { url, hasRecordNotFound, fullName };
        })()
      `,
      returnByValue: true,
    });
    console.log('Profile Verification (/profile/deew101):', JSON.stringify(deewProfileVerification.result.value, null, 2));

    const screenshotData2 = await send('Page.captureScreenshot', { format: 'png' });
    const screenshotPath2 = path.join(artifactDir, 'verified_profile_deew101.png');
    fs.writeFileSync(screenshotPath2, Buffer.from(screenshotData2.data, 'base64'));
    console.log('Saved deew101 screenshot to:', screenshotPath2);

    pageWs.close();
    console.log('=== PUBLIC PROFILE VERIFICATION COMPLETED SUCCESSFULLY ===');
  } finally {
    chromeInfo.proc.kill();
    server.close();
  }
}

runPublicProfileVerification().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
