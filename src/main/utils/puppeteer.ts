import puppeteer from 'puppeteer';

const userName = 'Radium';
const listenMessageEventName = 'listenMessage';

type ImageMessage = { tag: 'img'; image_key: string };
type TextMessage = { tag: 'text'; text: string; style: string };

type RichDocMessage = {
  title: string;
  content: TextMessage[] | ImageMessage[];
};

type MessageType = 'text-only' | 'rich-message' | 'image-only';

const getMessageType = (message: HTMLElement): MessageType | undefined => {
  if (message.classList.contains('.richTextDocs')) return 'rich-message';
  if (message.classList.contains('.richTextContainer')) return 'text-only';
  if (message.classList.contains('.img-container')) return 'image-only';
  return undefined;
};

const createMessageObject = (message: HTMLElement) => {
  if (message.classList.contains('text-only'))
    return {
      tag: 'text',
      text: message.innerText,
    };
};

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
    let sendMessageObject = {};
    const messageListElement = document.querySelector('.messageList');

    const mutationObserver = new MutationObserver((mutationsList) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const mutation of mutationsList) {
        const messageWrapper = mutation.target as HTMLElement;

        if (messageWrapper.classList.contains('messageItem-wrapper')) {
          const messageType = getMessageType(messageWrapper);

          switch (messageType) {
            case 'rich-message': {
              const childrenElementList =
                messageListElement?.querySelector('.richTextDocs')?.children;

              if (
                childrenElementList == null ||
                childrenElementList.length === 0
              )
                return;
              for (
                let index = 0;
                index < childrenElementList?.length;
                index += 1
              ) {
                const element = childrenElementList.item(index);
                if (element == null) return;

                createMessageObject(element as HTMLElement);

                sendMessageObject = {
                  text: '',
                  content: [],
                };
              }

              break;
            }

            default: {
              break;
            }
          }

          window.listenMessage(sendMessageObject);
        }
      }
    });

    if (messageListElement == null) return;

    mutationObserver.observe(messageListElement, {
      childList: true,
      subtree: true,
    });
  });
};

export { runPuppeteer };
