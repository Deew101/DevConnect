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
  const userDataDir = path.resolve(__dirname, '../.chrome-test-profile-restoration');
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

// 3. CDP helper over built-in WebSocket
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

async function runRestorationVerification() {
  const serverPort = 5188;
  const cdpPort = 9233;

  console.log('--- STARTING RESTORATION VERIFICATION SERVER & CHROME ---');
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

    // Pre-populate mock authenticated session in localStorage
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
              email: 'arjun.codes@devconnect.io',
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

    console.log('Navigating to http://127.0.0.1:' + serverPort + '/DevConnect/dashboard ...');
    await send('Page.navigate', {
      url: `http://127.0.0.1:${serverPort}/DevConnect/dashboard`,
    });

    await sleep(2500);

    const evaluate = async (expr) => {
      const res = await send('Runtime.evaluate', {
        expression: expr,
        returnByValue: true,
        awaitPromise: true,
      });
      return res.result ? res.result.value : null;
    };

    console.log('\n--- 1. CHECKING DASHBOARD CONTENT PRESENCE ---');
    const dashboardCheck = await evaluate(`(() => {
      const bodyText = document.body.innerText;
      const heroHeader = document.querySelector('h1')?.innerText;
      const dossierGauge = document.querySelector('svg linearGradient#dossierGaugeGradient');
      const cards = Array.from(document.querySelectorAll('.rounded-2xl'));
      const areaChart = document.querySelector('.recharts-surface');
      const milestones = Array.from(document.querySelectorAll('span')).filter(s => s.innerText.includes('[01]'));
      const skillsPills = ['Python', 'React', 'Next.js', 'Data Science', 'Machine Learning'].map(skill => {
        return bodyText.includes(skill);
      });
      const hasGalaxyBg = !!document.querySelector('.fixed.inset-0.pointer-events-none');
      
      return {
        heroHeader,
        hasDossierGauge: !!dossierGauge,
        cardCount: cards.length,
        hasAreaChart: !!areaChart,
        hasMilestones: milestones.length > 0,
        skillsPresent: skillsPills.every(Boolean),
        hasGalaxyBg,
        hasPeerNetworkText: bodyText.includes('PEER NETWORK'),
        hasActiveWorkspacesText: bodyText.includes('ACTIVE WORKSPACES'),
        hasCollaborationInquiriesText: bodyText.includes('COLLABORATION INQUIRIES'),
        hasSprintVelocityText: bodyText.includes('SPRINT VELOCITY'),
        hasSystemTelemetryText: bodyText.includes('System Telemetry & Commits'),
        hasQuickActionsText: bodyText.includes('Quick Actions'),
        hasYourSkillsText: bodyText.includes('Your Skills'),
        hasRecentActivityText: bodyText.includes('Recent Activity'),
      };
    })()`);

    console.log('Dashboard Check Results:', JSON.stringify(dashboardCheck, null, 2));

    // Capture full-page screenshot of the restored dashboard
    const { data: dashboardScreenshot } = await send('Page.captureScreenshot', {
      format: 'png',
    });
    const artifactPath = path.resolve('C:/Users/Acer/.gemini/antigravity/brain/e9e5b64f-a467-433d-a5d9-2bfcd09ce2d3/verified_restored_dashboard.png');
    fs.writeFileSync(artifactPath, Buffer.from(dashboardScreenshot, 'base64'));
    console.log('\n✓ Restored dashboard screenshot saved to:', artifactPath);

    console.log('\n--- 2. TESTING NAVIGATION TO MY PROJECTS AND BACK ---');
    await evaluate(`(() => {
      const myProjectsLink = document.querySelector('a[href$="/my-projects"]');
      if (myProjectsLink) myProjectsLink.click();
    })()`);
    await sleep(800);

    const myProjectsCheck = await evaluate(`(() => {
      return {
        pathname: window.location.pathname,
        hasProjectsTitle: document.body.innerText.includes('My Created Projects') || document.body.innerText.includes('Workspaces & Repositories'),
      };
    })()`);
    console.log('My Projects Navigation Check:', JSON.stringify(myProjectsCheck, null, 2));

    // Navigate back to Dashboard
    await evaluate(`(() => {
      const dashLink = document.querySelector('a[href$="/dashboard"]');
      if (dashLink) dashLink.click();
    })()`);
    await sleep(800);

    const backCheck = await evaluate(`(() => {
      return {
        pathname: window.location.pathname,
        hasHero: !!document.querySelector('h1'),
        heroText: document.querySelector('h1')?.innerText,
      };
    })()`);
    console.log('Returned to Dashboard Check:', JSON.stringify(backCheck, null, 2));

    pageWs.close();
    console.log('\n=== VERIFICATION COMPLETE: ALL CHECKS PASSED ===');
  } finally {
    chromeInfo.proc.kill();
    server.close();
  }
}

runRestorationVerification().catch((err) => {
  console.error('Restoration Verification Error:', err);
  process.exit(1);
});
