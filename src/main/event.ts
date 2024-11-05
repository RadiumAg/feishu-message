import { ipcMain } from 'electron';
import * as Lark from '@larksuiteoapi/node-sdk';
import { GlobalConfig, setConfig } from './config';

ipcMain.on('set-config', (_, globalConfig: GlobalConfig) => {
  setConfig(globalConfig);
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
