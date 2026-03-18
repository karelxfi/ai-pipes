import puppeteer from 'puppeteer';
import { resolve } from 'path';

async function main() {
  const htmlPath = process.argv[2];
  const outputPath = process.argv[3] || htmlPath.replace('index.html', 'screenshot.png');

  if (!htmlPath) {
    console.error('Usage: npx tsx scripts/screenshot.ts <path-to-index.html> [output.png]');
    process.exit(1);
  }

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 675 });

  const fileUrl = `file://${resolve(htmlPath)}`;
  await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait for charts to render
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: resolve(outputPath), type: 'png' });
  console.log(`Screenshot saved to ${resolve(outputPath)}`);

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
