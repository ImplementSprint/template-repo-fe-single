import { spawn } from 'node:child_process';
import process from 'node:process';
import { chromium, firefox, webkit } from 'playwright';

type BrowserName = 'chromium' | 'firefox' | 'webkit';

function resolveBrowser(name: string): BrowserName {
  if (name === 'firefox' || name === 'webkit') {
    return name;
  }

  return 'chromium';
}

function launchBrowser(name: BrowserName) {
  switch (name) {
    case 'firefox':
      return firefox.launch({ headless: true });
    case 'webkit':
      return webkit.launch({ headless: true });
    default:
      return chromium.launch({ headless: true });
  }
}

async function waitForServer(url: string, timeoutMs = 45_000): Promise<void> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const res = await fetch(url, { method: 'GET' });
      if (res.ok) {
        return;
      }
    } catch {
      // server is not ready yet
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error(`Timed out waiting for server at ${url}`);
}

async function main() {
  const port = process.env.PORT || '4173';
  const baseUrl = process.env.E2E_BASE_URL || `http://127.0.0.1:${port}`;
  const browserName = resolveBrowser(process.env.E2E_BROWSER || 'chromium');

  const app = spawn('npm', ['run', 'dev', '--', '--hostname', '127.0.0.1', '--port', port], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: process.env,
  });

  try {
    await waitForServer(baseUrl);

    const browser = await launchBrowser(browserName);
    const page = await browser.newPage();

    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    const text = await page.textContent('body');

    if (!text || !text.includes('To get started, edit')) {
      throw new Error('Expected landing page content was not found');
    }

    await browser.close();
    console.log(`Playwright smoke test passed on ${browserName}`);
  } finally {
    app.kill();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
