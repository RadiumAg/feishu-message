import * as Lark from '@larksuiteoapi/node-sdk';

// 监听端配置
const inputBaseConfig = {
  appId: 'cli_a7a27ca338a75013',
  appSecret: 'HglJUv5pcBxeyHmOXZXggcgF01eMThKQ',
};

// 发送端配置
const sendBaseConfig = {
  appId: 'cli_a7a27ca338a75013',
  appSecret: 'HglJUv5pcBxeyHmOXZXggcgF01eMThKQ',
};

function startup() {
  const sendClient = new Lark.Client(sendBaseConfig);

  const wsClient = new Lark.WSClient({
    ...inputBaseConfig,
    loggerLevel: Lark.LoggerLevel.debug,
  });

  wsClient.start({
    eventDispatcher: new Lark.EventDispatcher({}).register({
      'im.message.receive_v1': async (data) => {
        const {
          message: { chat_id, content, message_id },
        } = data;

        sendClient.im.message.forward({
          data: {
            receive_id: '',
          },
          path: {
            message_id,
          },
          params: {
            receive_id_type: 'union_id',
          },
        });
      },
    }),
  });
}

startup();
