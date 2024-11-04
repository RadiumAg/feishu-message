import * as Lark from '@larksuiteoapi/node-sdk';

// 监听端配置
const inputBaseConfig = {
  appId: 'cli_a7a27ca338a75013',
  appSecret: 'HglJUv5pcBxeyHmOXZXggcgF01eMThKQ',
};
// const inputBaseConfig = {
//   appId: 'cli_a7a2607535529013',
//   appSecret: '41CdyFvmQ1t5C6bc55bpafoTZ8gWuycN',
// };

// 发送端配置
const sendBaseConfigArray = [
  {
    appId: 'cli_a7a2607535529013',
    appSecret: '41CdyFvmQ1t5C6bc55bpafoTZ8gWuycN',
  },
];

function startup() {
  const sendClientArray = sendBaseConfigArray.map(
    (config) => new Lark.Client(config),
  );

  const wsClient = new Lark.WSClient({
    ...inputBaseConfig,
    loggerLevel: Lark.LoggerLevel.debug,
  });

  wsClient.start({
    eventDispatcher: new Lark.EventDispatcher({}).register({
      'im.message.receive_v1': async (data) => {
        const {
          message: { message_id, content },
        } = data;

        sendClientArray.forEach((sendClient) => {
          sendClient.im.message.create({
            data: {
              msg_type: 'text',
              content,
              receive_id: 'oc_16cdcdbe5aa217b9c66e55ec951f2ce8',
            },
            params: {
              receive_id_type: 'chat_id',
            },
          });
        });
      },
    }),
  });
}

startup();
