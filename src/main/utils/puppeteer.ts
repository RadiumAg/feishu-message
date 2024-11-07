import puppeteer from 'puppeteer';

const userName = 'Radium';

const runPuppeteer = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  const page = await browser.newPage();
  await page.goto('https://ezeb4r28vm.feishu.cn/next/messenger');
  await page
    .locator('[data-feed-id="7433401383485063169"] .a11y_feed_card_item')
    .click();

  setTimeout(async () => {
    const messageListElement = await page.locator(
      '.messageList-row-wrapper:last-child',
    )._;
    const elementUserName = await page.locator(
      '.messageList-row-wrapper:last-child message-info-name',
    )._?.textContent;

    if (elementUserName === userName) {
    }
  }, 1000);
};

export { runPuppeteer };
