import * as Lark from '@larksuiteoapi/node-sdk';
import { globalConfig, setConfig } from '../config';

/**
 * 创建发送端对象
 *
 */
const createSendClient = () => {
  const { sendChatGroupConfigArray: sendChatGroupConfig } = globalConfig;
  const clientArray = sendChatGroupConfig.map(
    (config) => new Lark.Client(config),
  );

  setConfig({ sendChatGroupClientArray: clientArray });
};

/**
 * 创建监听端对象
 *
 */
const createListenClient = () => {
  const { sendChatGroupClientArray, listenChatGroupConfigArray } = globalConfig;
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
            message: { content, message_type, receiveId },
          } = data;
          const sendClient = sendChatGroupClientArray.find(
            (client) => client.appId === wsClient.config.linkSendAppId,
          );

          if (receiveId == null) return;

          sendClient?.im.message.create({
            data: {
              content,
              msg_type: message_type,
              receive_id: 'oc_16cdcdbe5aa217b9c66e55ec951f2ce8',
            },
            params: {
              receive_id_type: 'chat_id',
            },
          });
        },
      }),
    });
  });

  setConfig({ listenChatGroupClientArray: clientArray });
};

export { createListenClient, createSendClient };
