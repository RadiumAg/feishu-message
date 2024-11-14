/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import puppeteer, { Page } from 'puppeteer';
import log from 'electron-log';
import { ImageMessage, RichDocMessage, TextMessage } from './type';
import { createBase64ToFile } from './file';
import { sendMessage } from '../api/tg-api';
import { getConfig } from './config';

type MessageType = 'text-only' | 'rich-message' | 'image-only';

const listenMessageEventName = 'listenMessage';

const getImageKey = async (url: string, page: Page) => {
  try {
    const { imageData, type } = (await page.evaluate(async (blobUrl) => {
      console.log('download url', blobUrl);

      const response = await fetch(blobUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve({ imageData: reader.result, type: blob.type });
        };
        reader.readAsDataURL(blob);
      });
    }, url)) as { imageData: string; type: string };

    // 将 Base64 编码的字符串转换为 Buffer 对象
    const file = createBase64ToFile(
      imageData,
      type,
      `upload-img.${type.split('/')[1]}`,
    );

    return '';
    // const image = await images(file);
  } catch (e) {
    log.error('getImgError', JSON.stringify(e));
    return '';
  }
};

/**
 * 监听消息列表
 *
 * @param {Page} page 监听群页面对象
 * @param {ListenChatGroupConfig} config // 群配置
 */
const evaluateListenMessaggee = async (
  page: Page,
  // eslint-disable-next-line no-undef
  config: ListenChatGroupConfig,
) => {
  // 使用page.exposeFunction()监听浏览器向nodejs发送事件回调
  await page.exposeFunction(
    listenMessageEventName,
    async (message: RichDocMessage) => {
      const richMessageArray = message.content
        .flat()
        .filter((msg) => msg.tag === 'img');

      for (const content of richMessageArray) {
        content.image_key = await getImageKey(content.image_key, page);
      }
      const { tgSendConfigArray } = config;

      if (tgSendConfigArray == null || tgSendConfigArray.length === 0) return;

      // TODO feishu
      // sendMessage(config.linkSendConfigArray, message);

      for (const tsSendConfig of tgSendConfigArray) {
        sendMessage({
          bot_name: tsSendConfig.botName,
          topic_name: tsSendConfig.topicName,
          message_text: message.content
            .map((msg) => {
              return msg.filter((_) => _.tag === 'text');
            })
            .flat()
            .map((msg) => msg.text)
            .join('\n'),
        });
      }
    },
  );

  // 等待messageList加载完成
  await page.waitForSelector('.messageList');

  // 监听messageList改变
  await page.evaluate(() => {
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

    /**
     *  创建消息对象
     *
     * @param {HTMLElement} message
     * @param {MessageType} type
     * @return {*}  {((ImageMessage | TextMessage)[])}
     */
    const createMessageObject = async (
      message: HTMLElement,
      type: MessageType,
    ): Promise<(ImageMessage | TextMessage)[]> => {
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
        if (message.classList.contains('rich-text-paragraph')) {
          const textRecord = [];
          const textOnlyMessageArray = message.children;

          for (let index = 0; index < textOnlyMessageArray.length; index += 1) {
            const element = textOnlyMessageArray.item(index);
            textRecord.push({
              tag: 'text',
              text: element?.textContent || '',
              style: [],
            } as TextMessage);
          }

          return textRecord;
        }
        // img need wait to load
        if (message.classList.contains('rich-text-image')) {
          const imgRecord: ImageMessage[] = [];
          const allImagSourcePromise: Promise<void>[] = [];
          const imageMessageArray = message.querySelectorAll('img');

          for (let index = 0; index < imageMessageArray.length; index += 1) {
            const element = imageMessageArray.item(index);

            allImagSourcePromise.push(
              new Promise((resolve) => {
                element.onload = () => {
                  console.log('img src', element?.src);
                  imgRecord.push({
                    tag: 'img',
                    image_key: element?.src,
                  } as ImageMessage);
                  resolve();
                };

                element.onerror = () => {
                  resolve();
                };
              }),
            );
          }

          await Promise.all(allImagSourcePromise);

          return imgRecord;
        }
      }
      return [];
    };

    const mutationObserver = new MutationObserver(async (mutationsList) => {
      const addedNodes: Node[] = [];

      mutationsList.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          addedNodes.push(node);
        });
      });
      console.log('addNodes', addedNodes);

      // eslint-disable-next-line no-restricted-syntax
      for (const addNode of addedNodes) {
        const sendMessageObject: RichDocMessage = {
          title: '',
          content: [],
        };
        const messageWrapper = addNode as HTMLElement;

        if (messageWrapper.classList.contains('messageList-row-wrapper')) {
          const richDocElement = messageWrapper.querySelector(
            '.richTextContainer > *',
          );
          console.log('richDocElement', richDocElement);
          if (richDocElement == null) return;
          const messageType = getMessageType(richDocElement as HTMLElement);
          console.log('messageType', messageType);

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

                const contentItem = await createMessageObject(
                  element as HTMLElement,
                  'rich-message',
                );
                if (contentItem)
                  (sendMessageObject as RichDocMessage).content.push(
                    contentItem,
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

                const contentItem = await createMessageObject(
                  element as HTMLElement,
                  'text-only',
                );
                if (contentItem)
                  (sendMessageObject as RichDocMessage).content.push(
                    contentItem,
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

          if (sendMessageObject.content.length > 0)
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

// eslint-disable-next-line no-undef
const runPuppeteer = async () => {
  const { listenChatGroupConfigArray } = await getConfig();
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    defaultViewport: null,
    args: ['--remote-debugging-port=9222'],
  });

  for (const config of listenChatGroupConfigArray) {
    const page = await browser.newPage();
    await page.goto('https://ezeb4r28vm.feishu.cn/next/messenger');
    await page
      .locator(`[data-feed-id="${config.feedId}"] .a11y_feed_card_item`)
      .click();

    await evaluateListenMessaggee(page, config);
  }
};

export { runPuppeteer };
export type { ImageMessage, TextMessage };
