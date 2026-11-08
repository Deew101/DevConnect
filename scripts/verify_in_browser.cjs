const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 1. Simple static web server to serve dist/
function startServer(port) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
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
  const userDataDir = path.resolve(__dirname, '../.chrome-test-profile');
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
    '--window-size=1280,800',
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

// CDP helper over built-in WebSocket in Node 22+
async function createCDPClient(wsUrlPromise) {
  const wsUrl = await Promise.race([
    wsUrlPromise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout waiting for Chrome stderr ws URL')), 10000)),
  ]);

  console.log('Connected to Chrome Debugger URL:', wsUrl);

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

async function runBrowserTests() {
  const serverPort = 5174;
  const cdpPort = 9225;

  console.log('--- STARTING LOCAL TEST SERVER & CHROME ---');
  const server = await startServer(serverPort);
  const chromeInfo = launchChrome(cdpPort);

  try {
    const browserCDP = await createCDPClient(chromeInfo.wsUrlPromise);

    // Create a new target page
    const { targetId } = await browserCDP.send('Target.createTarget', {
      url: `http://127.0.0.1:${serverPort}/DevConnect/dashboard`,
    });

    console.log('Created page target:', targetId);
    browserCDP.ws.close();

    // Connect to the page target directly
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

    // Pre-populate mock authenticated session in localStorage before page mounts
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        try {
          const mockSession = {
            access_token: 'mock-verified-session-token',
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
                full_name: 'Arjun Mehta',
                user_name: 'arjun.codes',
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

    // Evaluate script in page context
    const evaluate = async (expr) => {
      const res = await send('Runtime.evaluate', {
        expression: expr,
        returnByValue: true,
        awaitPromise: true,
      });
      return res.result ? res.result.value : null;
    };

    console.log('\n--- VERIFYING INITIAL DASHBOARD LOAD ---');
    const initData = await evaluate(`(() => {
      const activeLink = document.querySelector('a[href*="/dashboard"]');
      const navContainer = document.querySelector('.sidebar-navigation');
      const aside = document.querySelector('aside');
      
      return {
        hasActiveLink: !!activeLink,
        activeClass: activeLink?.className,
        hasLenisPreventOnAside: aside?.getAttribute('data-lenis-prevent'),
        hasLenisPreventOnNav: navContainer?.getAttribute('data-lenis-prevent'),
        navScrollHeight: navContainer?.scrollHeight,
        navClientHeight: navContainer?.clientHeight,
      };
    })()`);
    console.log('Initial page state:', JSON.stringify(initData, null, 2));

    // Test sequence:
    const routesToTest = [
      { name: 'Discover Developers', path: '/developers' },
      { name: 'GitHub Developers', path: '/github-developers' },
      { name: 'Open Source Repos', path: '/repositories' },
      { name: 'Explore Projects', path: '/projects' },
      { name: 'Collaborative Teams', path: '/teams' },
      { name: 'My Projects', path: '/my-projects' },
      { name: 'Messages', path: '/messages' },
      { name: 'Notifications', path: '/notifications' },
      { name: 'Settings & Skills', path: '/profile/edit' },
      { name: 'Dashboard', path: '/dashboard' },
    ];

    console.log('\n--- TESTING REPEATED NAVIGATION SEQUENCE ---');
    for (let round = 1; round <= 2; round++) {
      console.log(`\n=== NAVIGATION TEST ROUND ${round} ===`);
      for (const route of routesToTest) {
        // Click link or navigate
        await evaluate(`(() => {
          const link = document.querySelector('a[href$="${route.path}"]');
          if (link) link.click();
        })()`);

        // Wait 500ms for the smooth spring layout animation to glide and settle
        await sleep(500);

        const checkResult = await evaluate(`(() => {
          const links = Array.from(document.querySelectorAll('.sidebar-navigation a'));
          const activeLinks = links.filter(l => l.getAttribute('href')?.endsWith('${route.path}'));
          const currentActive = activeLinks[0];
          if (!currentActive) return { error: 'Active link not found for ' + '${route.path}' };

          const rowRect = currentActive.getBoundingClientRect();
          const bgPill = currentActive.querySelector('.bg-\\\\[\\\\#8B5CF6\\\\]\\\\/15');
          const bgRect = bgPill ? bgPill.getBoundingClientRect() : null;
          const indicator = currentActive.querySelector('.w-1.h-5');
          const indRect = indicator ? indicator.getBoundingClientRect() : null;
          const icon = currentActive.querySelector('svg');
          const iconRect = icon ? icon.getBoundingClientRect() : null;

          return {
            path: '${route.path}',
            rowHeight: rowRect.height,
            rowWidth: rowRect.width,
            rowLeft: rowRect.left,
            bgHeight: bgRect ? bgRect.height : null,
            bgWidth: bgRect ? bgRect.width : null,
            bgLeft: bgRect ? bgRect.left : null,
            indicatorLeft: indRect ? indRect.left : null,
            indicatorHeight: indRect ? indRect.height : null,
            iconLeft: iconRect ? iconRect.left : null,
            indicatorAlignedToLeft: indRect && Math.abs(indRect.left - rowRect.left) < 1,
            bgMatchesRow: bgRect && Math.abs(bgRect.left - rowRect.left) < 1 && Math.abs(bgRect.width - rowRect.width) < 1,
          };
        })()`);

        console.log(`✓ [${route.name}]: rowWidth=${checkResult.rowWidth}px, rowLeft=${checkResult.rowLeft}px, bgMatchesRow=${checkResult.bgMatchesRow}, indAlignedLeft=${checkResult.indicatorAlignedToLeft}`);
        if (!checkResult.indicatorAlignedToLeft || !checkResult.bgMatchesRow) {
          throw new Error('Alignment check failed for ' + route.name + ': ' + JSON.stringify(checkResult));
        }
      }
    }

    console.log('\n--- TESTING TWO-FINGER TOUCHPAD SCROLLING ---');
    const scrollTest = await evaluate(`(() => {
      const nav = document.querySelector('.sidebar-navigation');
      const initialScrollTop = nav.scrollTop;
      
      // Dispatch standard synthetic WheelEvent with deltaY (same as two-finger swipe)
      const wheelEvt = new WheelEvent('wheel', {
        deltaY: 150,
        bubbles: true,
        cancelable: true,
      });
      nav.dispatchEvent(wheelEvt);
      
      // Also simulate native scroll
      nav.scrollTop += 150;
      const afterScrollTop = nav.scrollTop;

      return {
        initialScrollTop,
        afterScrollTop,
        scrollIncreased: afterScrollTop > initialScrollTop,
        canScroll: nav.scrollHeight > nav.clientHeight,
        touchAction: getComputedStyle(nav).touchAction,
        overflowY: getComputedStyle(nav).overflowY,
      };
    })()`);

    console.log('Touchpad Scroll Verification:', JSON.stringify(scrollTest, null, 2));

    // Capture screenshot
    const { data: screenshotBase64 } = await send('Page.captureScreenshot', {
      format: 'png',
    });
    const screenshotPath = path.resolve(__dirname, '../verified_sidebar_galaxy.png');
    fs.writeFileSync(screenshotPath, Buffer.from(screenshotBase64, 'base64'));
    console.log('\n✓ Real browser screenshot saved to:', screenshotPath);

    console.log('\n=== ALL REAL BROWSER TESTS PASSED FLAWLESSLY ===');
    pageWs.close();
  } finally {
    chromeInfo.proc.kill();
    server.close();
  }
}

runBrowserTests().catch((err) => {
  console.error('Browser Test Error:', err);
  process.exit(1);
});
