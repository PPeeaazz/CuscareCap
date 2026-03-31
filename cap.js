const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const screenshotDesktop = require('screenshot-desktop');

let STEP = 0;
const log = msg => console.log(`[${new Date().toISOString()}] [STEP ${++STEP}] ${msg}`);

const ensureDir = name => {
  const dir = path.join(__dirname, 'screenshot', name);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
};

const snap = (dir, name) =>
  screenshotDesktop({ filename: path.join(dir, name) });

const gotoSearch = async (page, url, accountNo) => {
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // รอให้ UI หลักขึ้นก่อน
  await page.waitForTimeout(5000);

  await fillBillingAccount(page, accountNo);

  await page.getByRole('button', { name: 'ค้นหา' }).click();
  await page.waitForSelector('.p-datatable', { timeout: 60000 });
  await page.waitForTimeout(6000);
};
const pageScrollAndCapture = async (page, dir, prefix) => {
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  let part = 1;
  let lastScrollHeight = 0;

  while (true) {
    const scrollHeight = await page.evaluate(() =>
      Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
    );

    if (scrollHeight === lastScrollHeight) break;
    lastScrollHeight = scrollHeight;

    for (let y = 0; y < scrollHeight; y += viewportHeight) {
      await page.evaluate(y => window.scrollTo(0, y), y);
      await page.waitForTimeout(800);

      await screenshotDesktop({
        filename: path.join(dir, `${prefix}_part${part}.png`)
      });

      log(`Page scroll screenshot part ${part}`);
      part++;
    }
  }
};


const scrollAndCapture = async (page, dir, prefix) => {
  const vh = await page.evaluate(() => window.innerHeight);
  const sh = await page.evaluate(() => Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight
  ));
  let part = 1;
  for (let y = 0; y < sh; y += vh) {
    await page.evaluate(y => window.scrollTo(0, y), y);
    await page.waitForTimeout(3000);
    await snap(dir, `${prefix}_part${part++}.png`);
  }
};
const fillBillingAccount = async (page, accountNo) => {
  const selectors = [
    '#billingAccount',
    '#accountNum',
    '#inAccountNo', // 👈 BIQ706
    'input[placeholder="Billing Account"]',
    'input[placeholder="Billing Account Number"]'
  ];

  for (const sel of selectors) {
    const el = page.locator(sel);
    if (await el.count()) {
      await el.first().waitFor({ timeout: 20000 });
      await el.first().fill(accountNo);
      log(`Filled Billing Account using selector: ${sel}`);
      return;
    }
  }

  throw new Error('❌ Billing Account input not found (all selectors failed)');
};

const dialogScrollCapture = async (page, dir, prefix) => {
  const dialog = page.locator('.p-dialog-content');
  await dialog.waitFor();
  const { scrollHeight, clientHeight } = await dialog.evaluate(el => ({
    scrollHeight: el.scrollHeight,
    clientHeight: el.clientHeight
  }));

  let part = 1;
  for (let y = 0; y <= scrollHeight; y += clientHeight) {
    await dialog.evaluate((el, y) => el.scrollTo(0, y), y);
    await page.waitForTimeout(2000);
    await snap(dir, `${prefix}_part${part++}.png`);
  }
};

(async () => {
  try {
    log('Start');
    const browser = await chromium.launch({
      headless: false,
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      args: ['--start-maximized', '--force-device-scale-factor=1.1']
    });

    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();

    // LOGIN
    await page.goto('http://10.44.81.82/BIQ/#/');
    await page.locator('input').nth(0).fill('admin');
    await page.locator('input').nth(1).fill('1234');
    await page.locator('button').first().click();
    await page.waitForLoadState('networkidle');

    const date = new Date().toISOString().slice(0, 10);

    // ================= BIQ701 =================
          await page.waitForTimeout(6000);

    let accountNo = '700017388';
    const dir701 = ensureDir('BIQ701');
    await gotoSearch(page, 'http://10.44.81.82/BIQ/#/BIQ701', accountNo);
    await snap(dir701, `search_${accountNo}_${date}.png`);

    const eye = page.locator('button:has(span.fa-eye)').first();
    await eye.click();
    await page.waitForTimeout(5000);
    await dialogScrollCapture(page, dir701, `detail_${accountNo}_${date}`);

    // ================= BIQ702 =================
    const dir702 = ensureDir('BIQ702');
    await gotoSearch(page, 'http://10.44.81.82/BIQ/#/BIQ702', accountNo);
    await snap(dir702, `search_${accountNo}_${date}.png`);
    await eye.click();

for (const tab of ['Price Plan','Product','One Time Charge','Unit Free','Discount','Extend Data']) {
  await page.getByRole('tab', { name: tab }).click();

  const spinner = page.locator('.p-datatable-loading-overlay');
  const rows = page.locator('.p-datatable-tbody > tr');

  // จำจำนวน row ก่อนโหลด
  const beforeCount = await rows.count().catch(() => 0);

  // รอให้มีการโหลดเริ่มขึ้น (overlay โผล่) ถ้ามีจริง
  await spinner.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});

  if (await spinner.isVisible().catch(() => false)) {
    // รอจนโหลดเสร็จจริง
    await spinner.waitFor({ state: 'hidden', timeout: 0 });
  } else {
    // fallback: รอให้ row เปลี่ยนจากเดิม
    await page.waitForFunction(
      (selector, before) => {
        const els = document.querySelectorAll(selector);
        return els.length !== before;
      },
      '.p-datatable-tbody > tr',
      beforeCount,
      { timeout: 0 }
    );
  }

  // ให้ UI นิ่งก่อนแคป
  await page.waitForTimeout(5000);

  await snap(dir702, `${tab.replace(/ /g,'_')}_${accountNo}_${date}.png`);
}






    // ================= BIQ704 =================
    const dir704 = ensureDir('BIQ704');
    await gotoSearch(page, 'http://10.44.81.82/BIQ/#/BIQ704', accountNo, '#accountNum');
    await scrollAndCapture(page, dir704, `search_${accountNo}_${date}`);

    // ================= BIQ705 =================
    const dir705 = ensureDir('BIQ705');
    await gotoSearch(page, 'http://10.44.81.82/BIQ/#/BIQ705', accountNo);
    await scrollAndCapture(page, dir705, `search_${accountNo}_${date}`);

    // ================= BIQ706 =================
    for (const ba of [accountNo,'6595990']) {
      const dir = ensureDir(`BIQ706_${ba}`);
      await gotoSearch(page, 'http://10.44.81.82/BIQ/#/BIQ706', ba);
      await scrollAndCapture(page, dir, `search_${ba}_${date}`);
    }

    // ================= BIQ709 =================
    const dir709 = ensureDir('BIQ709');
    await gotoSearch(page, 'http://10.44.81.82/BIQ/#/BIQ709', accountNo);
    await eye.click();
      await page.waitForTimeout(5000);

    await scrollAndCapture(page, dir709, `detail_${date}`);

    // ================= BIQ710 =================
const biq710 = async (ba, ref, folder) => {
  const dir = ensureDir(folder);

  await page.goto('http://10.44.81.82/BIQ/#/BIQ710', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  await fillBillingAccount(page, ba);
  await page.getByPlaceholder('Bill Ref No').fill(ref);

  await page.getByRole('button', { name: 'ค้นหา' }).click();
  await page.waitForSelector('.p-datatable', { timeout: 60000 });

  // 👇 ปลุก page ก่อน
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1500);

  await pageScrollAndCapture(page, dir, `search_${ba}_${date}`);
};

    await biq710(accountNo,'605219296','BIQ710Default');
    await biq710('700615561','604967566','BIQ710');

    await browser.close();
    log('Finished');
  } catch (e) {
    console.error('❌ ERROR:', e);
  }
})();
