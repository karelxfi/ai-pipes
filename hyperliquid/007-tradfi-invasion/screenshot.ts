import puppeteer from 'puppeteer'

async function main() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--window-size=1200,675'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 675, deviceScaleFactor: 2 })
  await page.goto('file://' + process.cwd() + '/dashboard/index.html', { waitUntil: 'networkidle0', timeout: 30000 })
  await page.waitForFunction('window.__DASHBOARD_READY__ === true', { timeout: 30000 })
  await new Promise(r => setTimeout(r, 3000))
  await page.screenshot({ path: 'dashboard/screenshot.png', fullPage: false, clip: { x: 0, y: 0, width: 1200, height: 675 } })
  console.log('Done — 1200x675 @2x retina')
  await browser.close()
}

main().catch(e => { console.error(e); process.exit(1) })
