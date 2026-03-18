import puppeteer from 'puppeteer';
import { resolve, dirname } from 'path';
import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { extname } from 'path';

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.json': 'application/json',
};

async function main() {
  const htmlPath = process.argv[2];
  const outputPath = process.argv[3] || htmlPath.replace('index.html', 'screenshot.png');

  if (!htmlPath) {
    console.error('Usage: npx tsx scripts/screenshot.ts <path-to-index.html> [output.png]');
    process.exit(1);
  }

  const dir = dirname(resolve(htmlPath));

  // Serve the dashboard directory via a local HTTP server to avoid CORS issues
  const server = createServer((req, res) => {
    const filePath = resolve(dir, (req.url || '/').slice(1) || 'index.html');
    if (!existsSync(filePath)) { res.writeHead(404); res.end(); return; }
    const ext = extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'text/plain' });
    res.end(readFileSync(filePath));
  });

  await new Promise<void>(r => server.listen(0, r));
  const port = (server.address() as any).port;

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--disable-web-security', '--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 675 });

  // Log browser console for debugging
  page.on('console', msg => console.log(`Browser [${msg.type()}]:`, msg.text()));
  page.on('requestfailed', req => console.error('Request failed:', req.url(), req.failure()?.errorText));

  await page.goto(`http://localhost:${port}/index.html`, { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait for dashboard to signal it's ready, or timeout after 15s
  try {
    await page.waitForFunction('window.__DASHBOARD_READY__ === true', { timeout: 15000 });
    // Small extra delay for chart rendering to complete
    await new Promise(r => setTimeout(r, 1000));
  } catch {
    console.warn('Dashboard did not signal ready within 15s, capturing anyway');
    await new Promise(r => setTimeout(r, 2000));
  }

  await page.screenshot({ path: resolve(outputPath), type: 'png' });
  console.log(`Screenshot saved to ${resolve(outputPath)}`);

  await browser.close();
  server.close();
}

main().catch(e => { console.error(e); process.exit(1); });
