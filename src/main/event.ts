import { ipcMain } from 'electron';
import * as Lark from '@larksuiteoapi/node-sdk';
import { GlobalConfig, setConfig } from './config';
import { FormValue } from '../utils/type';
import { runPuppeteer } from './utils/puppeteer';

ipcMain.on('set-config', (event, globalConfig: string) => {
  const config = JSON.parse(globalConfig) as FormValue[];

  const listenChatGroupConfigArray = config.map<
    GlobalConfig['listenChatGroupConfigArray'][number]
  >((configValue) => {
    return {
      chatName: configValue.chatName,
      feedId: configValue.feedId,

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
        };
      }),
    };
  });

  setConfig({ listenChatGroupConfigArray });

  const updateData = listenChatGroupConfigArray.map<FormValue>(
    (listenConfig) => {
      const fsConfig =
        listenConfig.fsSendConfigArray?.map((sendConfigValue) => ({
          appId: sendConfigValue.appId,
          chatId: sendConfigValue.receiveId,
          appSecret: sendConfigValue.appSecret,
          chatName: sendConfigValue.chatName,
        })) || [];

      const tgConfig =
        listenConfig.tgSendConfigArray?.map((tgConfigValue) => ({
          botName: tgConfigValue.botName,
          topicName: tgConfigValue.topicName,
        })) || [];

      return {
        feedId: listenConfig.feedId,
        chatName: listenConfig.chatName,
        fsSendConfigArray: fsConfig,
        tgSendConfigArray: tgConfig,
      };
    },
  );

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
