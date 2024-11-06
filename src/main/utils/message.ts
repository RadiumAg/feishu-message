import * as Lark from '@larksuiteoapi/node-sdk';
import { globalConfig, setConfig } from '../config';

/**
 * 创建监听端对象
 *
 */
const createWsClient = () => {
  const { listenChatGroupConfigArray } = globalConfig;
  const clientArray = listenChatGroupConfigArray.map((config) => {
    const wsClient = new Lark.WSClient(config);
    wsClient.config = config;

    return wsClient;
  });

  clientArray.forEach((wsClient) => {
    wsClient.start({
      eventDispatcher: new Lark.EventDispatcher({}).register({
        'im.message.receive_v1': async (data) => {
          const {
            // eslint-disable-next-line camelcase
            message: { content, message_type },
          } = data;

          wsClient.config.linkSendConfigArray.forEach((sendConfig) => {
            const sendClient = new Lark.Client({
              appId: sendConfig.appId,
              appSecret: sendConfig.appSecret,
            });

            if (sendConfig.receiveId == null) return;

            sendClient?.im.message.create({
              data: {
                content,
                // eslint-disable-next-line camelcase
                msg_type: message_type,
                receive_id: sendConfig.receiveId,
              },
              params: {
                receive_id_type: 'chat_id',
              },
            });
          });
        },
      }),
    });
  });

  setConfig({ listenChatGroupClientArray: clientArray });
};

export { createWsClient };
