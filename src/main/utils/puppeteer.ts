import puppeteer, { Page } from 'puppeteer';

const userName = 'Radium';
const listenMessageEventName = 'listenMessage';

type ImageMessage = { tag: 'img'; image_key: string };
type TextMessage = { tag: 'text'; text: string; style: string[] };

type RichDocMessage = {
  title: string;
  content: (TextMessage | ImageMessage)[];
};

type MessageType = 'text-only' | 'rich-message' | 'image-only';

/**
 * 监听消息列表
 *
 * @param {Page} page
 */
const evaluateListenMessaggee = async (page: Page) => {
  // 使用page.exposeFunction()监听浏览器向nodejs发送事件回调
  await page.exposeFunction(listenMessageEventName, (message) => {
    console.log(message);
  });

  // 等待messageList加载完成
  await page.waitForSelector('.messageList');

  // 监听messageList改变
  await page.evaluate(() => {
    let sendMessageObject = {};
    const messageListElement = document.querySelector('.messageList');

    /**
     * 获取消息类型
     * @param message
     * @returns
     */
    const getMessageType = (message: HTMLElement): MessageType | undefined => {
      if (message.classList.contains('richTextDocs')) return 'rich-message';
      if (message.classList.contains('text-only')) return 'text-only';
      if (message.classList.contains('img-container')) return 'image-only';
      return undefined;
    };

    const createMessageObject = (
      message: HTMLElement,
      type: MessageType,
    ): (ImageMessage | TextMessage)[] | [] => {
      if (type === 'text-only') {
        const textElementObject: TextMessage = {
          text: '',
          tag: 'text',
          style: [],
        };

        textElementObject.text = message.textContent || '';

        return [textElementObject];
      }
      if (type === 'rich-message') {
        const textRecord = [];
        const imgRecord = [];

        const textRecordElementArray = message.querySelector(
          '.rich-text-paragraph',
        )?.children;
        const imgRecordElementArray = message.querySelector(
          '.figure.rich-text-image',
        )?.children;

        if (textRecordElementArray) {
          for (
            let index = 0;
            index < textRecordElementArray.length;
            index += 1
          ) {
            const textRecordContent = textRecordElementArray.item(index);
            textRecord.push({
              type: 'text',
              style: [],
              text: textRecordContent?.textContent,
            });
          }
        }
      }
    };

    const mutationObserver = new MutationObserver((mutationsList) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const mutation of mutationsList) {
        const messageWrapper = mutation.target as HTMLElement;

        if (messageWrapper.classList.contains('messageItem-wrapper')) {
          const richDocElement = messageWrapper.querySelector(
            '.richTextContainer > *',
          );
          console.log('richDocElement', richDocElement);
          if (richDocElement == null) return;
          const messageType = getMessageType(richDocElement as HTMLElement);
          console.log('messageType', messageType);

          sendMessageObject = {
            text: '',
            content: [],
          };

          switch (messageType) {
            case 'rich-message': {
              const childrenElementList =
                messageWrapper?.querySelector('.richTextDocs')?.children;

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

                const contentItem = createMessageObject(
                  element as HTMLElement,
                  'rich-message',
                );
                if (contentItem)
                  (sendMessageObject as RichDocMessage).content.push(
                    ...contentItem,
                  );
              }

              break;
            }

            case 'text-only': {
              const childrenElementList =
                messageWrapper?.querySelector('.richTextContainer')?.children;

              if (
                childrenElementList == null ||
                childrenElementList.length === 0
              )
                return;

              console.log('childrenElementList', childrenElementList);

              for (
                let index = 0;
                index < childrenElementList?.length;
                index += 1
              ) {
                const element = childrenElementList.item(index);
                if (element == null) return;

                const contentItem = createMessageObject(
                  element as HTMLElement,
                  'text-only',
                );
                if (contentItem)
                  (sendMessageObject as RichDocMessage).content.push(
                    ...contentItem,
                  );
              }

              break;
            }

            case 'image-only': {
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

  await evaluateListenMessaggee(page);
};

export { runPuppeteer };
