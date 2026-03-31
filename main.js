const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const screenshotDesktop = require('screenshot-desktop');
// ===============================
// AUTO STEP LOGGER
// ===============================
let STEP = 0;
function log(message) {
  STEP++;
  const time = new Date().toISOString();
  console.log(`[${time}] [STEP ${STEP}] ${message}`);
}

// ===============================
// 📁 ENSURE PAGE FOLDER
// ===============================
function ensureDir(pageName) {
  const dir = path.join(__dirname, 'screenshot', pageName);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    log(`Created folder: screenshot/${pageName}`);
  }
  return dir;
}

(async () => {
  try {
    log('Script started');

    // ===============================
    // 1️⃣ Launch browser
    // ===============================
const browser = await chromium.launch({
  headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--start-maximized',
        '--force-device-scale-factor=1.1' // 👈 ZOOM OUT จริง
  ]
});

const context = await browser.newContext({
  viewport: null ,  // 👈 fullscreen จริง
});

const page = await context.newPage();
    log('Browser launched');

    // ===============================
    // 2️⃣ LOGIN
    // ===============================
    log('Navigating to login page');
    await page.goto('http://10.44.81.82/BIQ/#/', {
      waitUntil: 'domcontentloaded'
    });

    await page.waitForSelector('input', { timeout: 60000 });
    const inputs = page.locator('input');

    await inputs.nth(0).fill('admin');
    await inputs.nth(1).fill('1234');
    await page.locator('button').first().click();queueMicrotask

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
    // ===============================
    // 🚫 REMOVE TOASTIFY
    // ===============================


    const date = new Date().toISOString().slice(0, 10);
    let accountNo = '701495762';
    let billNum ='609598757'
    // ======================= BIQ701 ===========================
    // ==========================================================
    let pathAccount = accountNo;
    const dir701 = ensureDir(`${pathAccount}/BIQ701`);
    log('Navigating to BIQ701');
    await page.goto('http://10.44.81.82/BIQ/#/BIQ701', {
      waitUntil: 'domcontentloaded'
    });


    await page.waitForSelector('#billingAccount', { timeout: 60000 });
    await page.fill('#billingAccount', accountNo);

    await page.getByRole('button', { name: 'ค้นหา' }).click();
    await page.waitForSelector('.p-datatable', { timeout: 60000 });
    await page.waitForTimeout(3500);

    log('Screenshot BIQ701 search');
    // await page.screenshot({
    //   path: path.join(dir701, `search_${accountNo}_${date}.png`),
    //   fullPage: true
    // });

        await screenshotDesktop({
      filename: path.join(dir701, `search_${accountNo}_${date}.png`)
    });

log('Captured full Windows screen with taskbar & time');

    // 👁 Eye detail
    const eyeButton = page.locator('button:has(span.fa-eye)').first();
    await eyeButton.waitFor();
    await eyeButton.click();

    await page.waitForTimeout(800);
const dialogContent = page.locator('.p-dialog-content');
await dialogContent.waitFor();

const { scrollHeight, clientHeight } = await dialogContent.evaluate(el => ({
  scrollHeight: el.scrollHeight,
  clientHeight: el.clientHeight
}));

let part = 1;

// เลื่อนทีละหน้าของ dialog
for (let y = 0; y <= scrollHeight - clientHeight; y += clientHeight) {
  await dialogContent.evaluate((el, y) => {
    el.scrollTo(0, y);
  }, y);

  await page.waitForTimeout(1000);

  await screenshotDesktop({
    filename: path.join(
      dir701,
      `detail_${accountNo}_${date}_part${part}.png`
    )
  });

  log(`BIQ701 detail screenshot part ${part}`);
  part++;
}

// 🔥 บังคับเลื่อนถึงล่างสุดจริง (กันกรณีเหลือเศษ)
await dialogContent.evaluate(el => {
  el.scrollTo(0, el.scrollHeight);
});
await page.waitForTimeout(1000);
log(`BIQ701 detail screenshot part ${part} (BOTTOM)`);

await screenshotDesktop({
  filename: path.join(
    dir701,
    `detail_${accountNo}_${date}_part${part}.png`
  )
});



    
    // ==========================================================
    // ======================= BIQ702 ===========================
    // ==========================================================
    const dir702 = ensureDir(`${pathAccount}/BIQ702`);

    log('Navigating to BIQ702');
    await page.goto('http://10.44.81.82/BIQ/#/BIQ702', {
      waitUntil: 'domcontentloaded'
    });

    await page.waitForSelector('#billingAccount', { timeout: 60000 });
    await page.fill('#billingAccount', accountNo);

    await page.getByRole('button', { name: 'ค้นหา' }).click();
    await page.waitForSelector('.p-datatable', { timeout: 60000 });
    await page.waitForTimeout(6500);

    log('Screenshot BIQ702 search');
    // await page.screenshot({
    //   path: path.join(dir702, `search_${accountNo}_${date}.png`),
    //   fullPage: true
    // });
        await screenshotDesktop({
      filename: path.join(dir702, `search_${accountNo}_${date}.png`)
    });
    // 👁 Eye detail
    await eyeButton.waitFor();
    await eyeButton.click();
    await page.waitForTimeout(4500);

    log('Screenshot BIQ702 detail1');
    // await page.screenshot({
    //   path: path.join(dir702, `detail1_${accountNo}_${date}.png`),
    //   fullPage: true
    // });

        await screenshotDesktop({
      filename: path.join(dir702, `detail1_${accountNo}_${date}.png`)
    });

const productTab = page.getByRole('tab', { name: 'Product' });
await productTab.waitFor();
await productTab.click();
    await page.waitForTimeout(4500);

    log('Screenshot BIQ702 detail2');
    // await page.screenshot({
    //   path: path.join(dir702, `detail2_${accountNo}_${date}.png`),
    //   fullPage: true
    // });

        await screenshotDesktop({
      filename: path.join(dir702, `detail2_${accountNo}_${date}.png`)
    });


const OneTimeTab = page.getByRole('tab', { name: 'One Time Charge' });
await OneTimeTab.waitFor();
await OneTimeTab.click();
    await page.waitForTimeout(4500);

    log('Screenshot BIQ702 detail3');
    // await page.screenshot({
    //   path: path.join(dir702, `detail3_${accountNo}_${date}.png`),
    //   fullPage: true
    // });

        await screenshotDesktop({
      filename: path.join(dir702, `detail3_${accountNo}_${date}.png`)
    });


const UnitFreeTab = page.getByRole('tab', { name: 'Unit Free' });
await UnitFreeTab.waitFor();
await UnitFreeTab.click();
    await page.waitForTimeout(4500);

    log('Screenshot BIQ702 detail4');
    // await page.screenshot({
    //   path: path.join(dir702, `detail4_${accountNo}_${date}.png`),
    //   fullPage: true
    // });

        await screenshotDesktop({
      filename: path.join(dir702, `detail4_${accountNo}_${date}.png`)
    });


const DiscountTab = page.getByRole('tab', { name: 'Discount' });
await DiscountTab.waitFor();
await DiscountTab.click();
    await page.waitForTimeout(4500);

    log('Screenshot BIQ702 detail5');
    // await page.screenshot({
    //   path: path.join(dir702, `detail5_${accountNo}_${date}.png`),
    //   fullPage: true
    // });

        await screenshotDesktop({
      filename: path.join(dir702, `detail5_${accountNo}_${date}.png`)
    });

const ExtendDataTab = page.getByRole('tab', { name: 'Extend Data' });
await ExtendDataTab.waitFor();
await ExtendDataTab.click();
    await page.waitForTimeout(4500);

    log('Screenshot BIQ702 detail6');
    // await page.screenshot({
    //   path: path.join(dir702, `detail6_${accountNo}_${date}.png`),
    //   fullPage: true
    // });

        await screenshotDesktop({
      filename: path.join(dir702, `detail6_${accountNo}_${date}.png`)
    });



// ==========================================================
    // ======================= BIQ704 ===========================
    // ==========================================================
    const dir704 = ensureDir(`${pathAccount}/BIQ704`);

    log('Navigating to BIQ704');
    await page.goto('http://10.44.81.82/BIQ/#/BIQ704', {
      waitUntil: 'domcontentloaded'
    });

await page.getByPlaceholder('Billing Account').fill(accountNo);
+ await page.fill('#accountNum', accountNo);
    await page.getByRole('button', { name: 'ค้นหา' }).click();
    await page.waitForSelector('.p-datatable', { timeout: 60000 });
    await page.waitForTimeout(4500);

// ===============================
// 📸 BIQ704 – SCROLL & CAPTURE
// ===============================
log('Scrolling and capturing BIQ704');

const viewportHeight2 = await page.evaluate(() => window.innerHeight);


// ความสูงจริงของหน้า
const scrollHeight2 = await page.evaluate(() => {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight
  );
});

let part704 = 1;

for (let y = 0; y < scrollHeight2; y += viewportHeight2) {
  await page.evaluate((y) => {
    window.scrollTo(0, y);
  }, y);

  await page.waitForTimeout(800); // ให้ table render ก่อน

  // await page.screenshot({
  //   path: path.join(
  //     dir704,
  //     `search_${accountNo}_${date}_part${part704}.png`
  //   )
  // });
        await screenshotDesktop({
      filename: path.join(dir704, `search_${accountNo}_${date}_part${part704}.png`)
    });

  log(`BIQ704 screenshot part ${part704}`);
  part704++;
}















   accountNo = '9200278009';
let billingrefnumberDefault = billNum;
// ==========================================================
    // ======================= BIQ710 ===========================
    // ==========================================================
    const dir710Default = ensureDir(`${pathAccount}/710Default`);

    log('Navigating to BIQ710');
    await page.goto('http://10.44.81.82/BIQ/#/BIQ710', {
      waitUntil: 'domcontentloaded'
    });

log('Waiting for Billing Account input');

const billingInputdefault = page.getByPlaceholder('Billing Account');
await billingInputdefault.waitFor({ timeout: 60000 });

log(`Filling Billing Account: ${accountNo}`);
await billingInputdefault.fill(accountNo);



const billingrefnoD = page.getByPlaceholder('Bill Ref No');
await billingrefnoD.waitFor({ timeout: 60000 });

log(`Filling Billing Reference Number: ${billingrefnumberDefault}`);
await billingrefnoD.fill(billingrefnumberDefault);




    await page.getByRole('button', { name: 'ค้นหา' }).click();
    await page.waitForSelector('.p-datatable', { timeout: 60000 });
    await page.waitForTimeout(4500);

    log('Screenshot BIQ710Default search');
    // await page.screenshot({
    //   path: path.join(dir710Default, `search_${accountNo}_${date}.png`),
    //   fullPage: true
    // });

            await screenshotDesktop({
      filename: path.join(dir710Default, `search_${accountNo}_${date}.png`)
    });
   
// ===============================
// 📸 BIQ710 – SCROLL & CAPTURE
// ===============================
log('Scrolling and capturing BIQ710');

const viewportHeight6 = await page.evaluate(() => window.innerHeight);


// ความสูงจริงของหน้า
const scrollHeight6 = await page.evaluate(() => {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight
  );
});

let part710D = 1;

for (let y = 0; y < scrollHeight6; y += viewportHeight6) {
  await page.evaluate((y) => {
    window.scrollTo(0, y);
  }, y);

  await page.waitForTimeout(1000); // ให้ table render ก่อน

  // await page.screenshot({
  //   path: path.join(
  //     dir710,
  //     `search_${accountNo}_${date}_part${part710}.png`
  //   )
  // });
            await screenshotDesktop({
      filename: path.join(dir710Default, `search_${accountNo}_${date}_part${part710D}.png`)
    });
  log(`BIQ710 screenshot part ${part710D}`);
  part710D++;
}

    accountNo = '6714113';










// ==========================================================
    // ======================= BIQ705 ===========================
    // ==========================================================
    const dir705 = ensureDir(`${pathAccount}/BIQ705`);

    log('Navigating to BIQ705');
    await page.goto('http://10.44.81.82/BIQ/#/BIQ705', {
      waitUntil: 'domcontentloaded'
    });

log('Waiting for Billing Account input');

const billingInput = page.getByPlaceholder('Billing Account');
await billingInput.waitFor({ timeout: 60000 });

log(`Filling Billing Account: ${accountNo}`);
await billingInput.fill(accountNo);
    await page.getByRole('button', { name: 'ค้นหา' }).click();
    await page.waitForSelector('.p-datatable', { timeout: 60000 });
    await page.waitForTimeout(6500);



  await screenshotDesktop({
    filename: path.join(
      dir705,
      `search_${accountNo}_${date}.png`
    )
  });

// ===============================
// 📸 BIQ705 – SCROLL & CAPTURE
// ===============================
const viewportHeight = await page.evaluate(() => window.innerHeight);

for (let i = 0.5; i <= 2; i++) {
  const scrollY = viewportHeight * i;

  await page.evaluate(y => {
    window.scrollTo(0, y);
  }, scrollY);

  // รอ render ตาราง
  await page.waitForTimeout(1000);

  await screenshotDesktop({
    filename: path.join(
      dir705,
      `search_${accountNo}_${date}_scroll${i+0.5}.png`
    )
  });

  log(`BIQ705 screenshot after full scroll ${i+0.5}`);
}


// ==========================================================
    // ======================= BIQ706 ===========================
    // ==========================================================
    const dir706 = ensureDir(`${pathAccount}/706`);

    log('Navigating to BIQ706');
    await page.goto('http://10.44.81.82/BIQ/#/BIQ706', {
      waitUntil: 'domcontentloaded'
    });
  //  await page.screenshot({
  //     path: path.join(dir706, `search_before_${accountNo}_${date}.png`),
  //     fullPage: true
  //   });
        await screenshotDesktop({
      filename: path.join(dir706, `search_before_${accountNo}_${date}.png`)
    });

log('Waiting for Billing Account input');

const billingInput2 = page.getByPlaceholder('Billing Account');
await billingInput2.waitFor({ timeout: 60000 });

log(`Filling Billing Account: ${accountNo}`);
await billingInput2.fill(accountNo);
    await page.getByRole('button', { name: 'ค้นหา' }).click();
    await page.waitForSelector('.p-datatable', { timeout: 60000 });
    await page.waitForTimeout(4500);

    log('Screenshot BIQ706 search');
    // await page.screenshot({
    //   path: path.join(dir706, `search_${accountNo}_${date}.png`),
    //   fullPage: true
    // });
            await screenshotDesktop({
      filename: path.join(dir706, `search_${accountNo}_${date}.png`)
    });
    await page.waitForTimeout(5000);





    accountNo = '6595990';


// ==========================================================
    // ======================= BIQ706 with another BA ===========================
    // ==========================================================
    const dir706_6595990 = ensureDir(`${pathAccount}/BIQ706_6595990`);

    log('Navigating to BIQ706_6595990');
    await page.goto('http://10.44.81.82/BIQ/#/BIQ706', {
      waitUntil: 'domcontentloaded'
    });


log('Waiting for Billing Account input');

const billingInput2_6595990 = page.getByPlaceholder('Billing Account');
await billingInput2_6595990.waitFor({ timeout: 60000 });
log(`Filling Billing Account: ${accountNo}`);
await billingInput2_6595990.fill(accountNo);
    await page.getByRole('button', { name: 'ค้นหา' }).click();
    await page.waitForSelector('.p-datatable', { timeout: 60000 });
    await page.waitForTimeout(4500);

    log('Screenshot BIQ706 search');

// ===============================
// 📸 BIQ706 – SCROLL & CAPTURE
// ===============================
log('Scrolling and capturing BIQ706');

const viewportHeight706 = await page.evaluate(() => window.innerHeight);


// ความสูงจริงของหน้า
const scrollHeight706 = await page.evaluate(() => {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight
  );
});

let part706 = 1;

for (let y = 0; y < scrollHeight706; y += viewportHeight706) {
  await page.evaluate((y) => {
    window.scrollTo(0, y);
  }, y);

  await page.waitForTimeout(1000); // ให้ table render ก่อน

  // await page.screenshot({
  //   path: path.join(
  //     dir709,
  //     `search_${accountNo}_${date}_part${part709}.png`
  //   )
  // });
            await screenshotDesktop({
      filename: path.join(dir706_6595990, `search_${accountNo}_${date}_part${part706}.png`)
    });
  log(`BIQ706 screenshot part ${part706}`);
  part706++;
}



    accountNo = '6714113';



// ==========================================================
    // ======================= BIQ709 ===========================
    // ==========================================================
    const dir709 = ensureDir(`${pathAccount}/BIQ709`);

    log('Navigating to BIQ709');
    await page.goto('http://10.44.81.82/BIQ/#/BIQ709', {
      waitUntil: 'domcontentloaded'
    });

log('Waiting for Billing Account input');

const billingInput3 = page.getByPlaceholder('Billing Account');
await billingInput3.waitFor({ timeout: 60000 });

log(`Filling Billing Account: ${accountNo}`);
await billingInput3.fill(accountNo);
    await page.getByRole('button', { name: 'ค้นหา' }).click();
    await page.waitForSelector('.p-datatable', { timeout: 60000 });
    await page.waitForTimeout(4500);

    log('Screenshot BIQ709 search');
    // await page.screenshot({
    //   path: path.join(dir709, `search_${accountNo}_${date}.png`),
    //   fullPage: true
    // });

            await screenshotDesktop({
      filename: path.join(dir709, `search_${accountNo}_${date}.png`)
    });
    // 👁 Eye detail
    await eyeButton.waitFor();
    await eyeButton.click();
    await page.waitForTimeout(7500);

// ===============================
// 📸 BIQ709 – SCROLL & CAPTURE
// ===============================
log('Scrolling and capturing BIQ709');

const viewportHeight4 = await page.evaluate(() => window.innerHeight);


// ความสูงจริงของหน้า
const scrollHeight4 = await page.evaluate(() => {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight
  );
});

let part709 = 1;

for (let y = 0; y < scrollHeight4; y += viewportHeight4) {
  await page.evaluate((y) => {
    window.scrollTo(0, y);
  }, y);

  await page.waitForTimeout(1000); // ให้ table render ก่อน

  // await page.screenshot({
  //   path: path.join(
  //     dir709,
  //     `search_${accountNo}_${date}_part${part709}.png`
  //   )
  // });
            await screenshotDesktop({
      filename: path.join(dir709, `search_${accountNo}_${date}_part${part709}.png`)
    });
  log(`BIQ709 screenshot part ${part709}`);
  part709++;
}








































    accountNo = '9200273027';
let billingrefnumber = '605026557';
// ==========================================================
    // ======================= BIQ710 ===========================
    // ==========================================================
    const dir710 = ensureDir(`${pathAccount}/BIQ710`);

    log('Navigating to BIQ710');
    await page.goto('http://10.44.81.82/BIQ/#/BIQ710', {
      waitUntil: 'domcontentloaded'
    });

log('Waiting for Billing Account input');

const billingInput4 = page.getByPlaceholder('Billing Account');
await billingInput4.waitFor({ timeout: 60000 });

log(`Filling Billing Account: ${accountNo}`);
await billingInput4.fill(accountNo);




const billingrefno = page.getByPlaceholder('Bill Ref No');
await billingrefno.waitFor({ timeout: 60000 });

log(`Filling Billing Reference Number: ${billingrefnumber}`);
await billingrefno.fill(billingrefnumber);







    await page.getByRole('button', { name: 'ค้นหา' }).click();
    await page.waitForSelector('.p-datatable', { timeout: 60000 });
    await page.waitForTimeout(4500);

    log('Screenshot BIQ710 search');
    // await page.screenshot({
    //   path: path.join(dir710, `search_${accountNo}_${date}.png`),
    //   fullPage: true
    // });

            await screenshotDesktop({
      filename: path.join(dir710, `search_${accountNo}_${date}.png`)
    });
   
// ===============================
// 📸 BIQ710 – SCROLL & CAPTURE
// ===============================
log('Scrolling and capturing BIQ710');

const viewportHeight5 = await page.evaluate(() => window.innerHeight);


// ความสูงจริงของหน้า
const scrollHeight5 = await page.evaluate(() => {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight
  );
});

let part710 = 1;

for (let y = 0; y < scrollHeight5; y += viewportHeight5) {
  await page.evaluate((y) => {
    window.scrollTo(0, y);
  }, y);

  await page.waitForTimeout(1000); // ให้ table render ก่อน

  // await page.screenshot({
  //   path: path.join(
  //     dir710,
  //     `search_${accountNo}_${date}_part${part710}.png`
  //   )
  // });
            await screenshotDesktop({
      filename: path.join(dir710, `search_${accountNo}_${date}_part${part710}.png`)
    });
  log(`BIQ710 screenshot part ${part710}`);
  part710++;
}


















    // ===============================
    // CLOSE
    // ===============================
    log('All screenshots completed');
    await browser.close();
    log('Script finished successfully');

  } catch (err) {
    console.error('❌ Script failed:', err);
  }
})();
