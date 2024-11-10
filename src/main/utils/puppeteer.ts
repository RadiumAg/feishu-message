import puppeteer from 'puppeteer';

const userName = 'Radium';
const listenMessageEventName = 'listenMessage';

const checkSendName = (sendUserName: string, node: Node) => {};

const runPuppeteer = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    defaultViewport: null,
    args: ['--remote-debugging-port=9222'],
  });

  const page = await browser.newPage();
  await page.goto('https://ezeb4r28vm.feishu.cn/next/messenger');
  await page
    .locator('[data-feed-id="7433401383485063169"] .a11y_feed_card_item')
    .click();

  // 使用page.exposeFunction()向浏览器发送事件回调
  await page.exposeFunction(listenMessageEventName, (message) => {
    console.log(message);
  });

  await page.waitForSelector('.messageList');

  // 监听messageList改变
  await page.evaluate(() => {
    const mutationObserver = new MutationObserver((mutationsList) => {
      console.error('mutationsList', mutationsList);

      // eslint-disable-next-line no-restricted-syntax
      for (const mutation of mutationsList) {
        console.error('classList', (mutation.target as HTMLElement).classList);

        if (
          (mutation.target as HTMLElement).classList.contains(
            'messageItem-wrapper',
          )
        ) {
          console.log(mutation.target.textContent);
          window.listenMessage(mutation.target.textContent!);
        }
      }
    });

    const messageListElement = document.querySelector('.messageList');

    if (messageListElement == null) return;

    mutationObserver.observe(messageListElement, {
      childList: true,
      subtree: true,
    });
  });
};

export { runPuppeteer };
