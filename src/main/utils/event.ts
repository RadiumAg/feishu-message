import { ipcMain } from 'electron';
import * as Lark from '@larksuiteoapi/node-sdk';
import {
  getConfig,
  GlobalConfig,
  initConfig,
  setConfig,
  transformToFormValue,
} from './config';
import { FormValue } from '../../renderer/utils/type';
import { runPuppeteer } from './puppeteer';

ipcMain.on('set-config', async (event, globalConfig: string) => {
  const config = JSON.parse(globalConfig) as FormValue[];

  const listenChatGroupConfigArray = config.map<
    GlobalConfig['listenChatGroupConfigArray'][number]
  >((configValue) => {
    return {
      id: configValue.id,
      chatName: configValue.chatName,
      feedId: configValue.feedId,
      tagFeedId: configValue.tagFeedId,
      fsSendConfigArray: configValue.fsSendConfigArray?.map((sendConfig) => {
        return {
          appId: sendConfig.appId,
          chatId: sendConfig.chatId,
          chatName: sendConfig.chatName,
          receiveId: sendConfig.chatId,
          appSecret: sendConfig.appSecret,
        };
      }),

      tgSendConfigArray: configValue.tgSendConfigArray?.map((sendConfig) => {
        return {
          botName: sendConfig.botName,
          topicName: sendConfig.topicName,
          isSendImg: sendConfig.isSendImg,
        };
      }),
    };
  });

  setConfig({ listenChatGroupConfigArray });

  const updateData = transformToFormValue(await getConfig());

  event.reply('update-data', JSON.stringify(updateData));
});

ipcMain.on('get-chat-id', (event, appId: string, appSecret: string) => {
  const wsClient = new Lark.WSClient({ appId, appSecret });

  return Promise.race([
    new Promise((resolve) => {
      wsClient.start({
        eventDispatcher: new Lark.EventDispatcher({}).register({
          'im.message.receive_v1': async (data) => {
            resolve(data.message.chat_id);
          },
        }),
      });
    }),
    new Promise((resolve) => {
      setTimeout(() => {
        resolve('timeout');
      }, 10000);
    }),
    // eslint-disable-next-line promise/always-return
  ]).then((data) => {
    event.reply('get-chat-id', data);
  });
});

ipcMain.on('start-puppeteer', () => {
  runPuppeteer();
});

ipcMain.on('init-data', async (event) => {
  await initConfig();
  const config = await getConfig();

  const updateData = transformToFormValue(config);

  event.reply('init-data', JSON.stringify(updateData));
});
