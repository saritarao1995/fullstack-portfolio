import { chromium } from 'playwright-core';

const edge =
  process.env['ProgramFiles(x86)'] + '\\Microsoft\\Edge\\Application\\msedge.exe';

const browser = await chromium.launch({
  executablePath: edge,
  headless: true,
});

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:5178/studio', { waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'Enter studio' }).click();
await page.waitForURL('**/studio/dashboard', { timeout: 15000 });
await page.waitForTimeout(2500);
await page.screenshot({
  path: 'F:/bloackchain/velora/screenshots/admin-dashboard.png',
  fullPage: true,
});
await page.goto('http://localhost:5178/studio/orders', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.screenshot({
  path: 'F:/bloackchain/velora/screenshots/admin-orders.png',
  fullPage: true,
});
await browser.close();
