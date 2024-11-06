import puppeteer from 'puppeteer';

const runPuppeteer = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [''],
  });
  const page = await browser.newPage();
  await page.goto('https://eabxwfafdhx.feishu.cn');
  page.reload();
};

export { runPuppeteer };
