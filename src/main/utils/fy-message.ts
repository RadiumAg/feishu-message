import * as Lark from '@larksuiteoapi/node-sdk';
import log from 'electron-log';
import { RichDocMessage } from './type';

/**
 * 创建监听端对象
 *
 */
const sendMessage = (
  // eslint-disable-next-line no-undef
  sendConfigArray: ListenChatGroupConfig['fsSendConfigArray'],
  message: RichDocMessage,
) => {
  sendConfigArray?.forEach((sendConfig) => {
    const sendClient = new Lark.Client({
      appId: sendConfig.appId,
      appSecret: sendConfig.appSecret,
    });

    if (sendConfig.receiveId == null) return;
    log.info(
      JSON.stringify({
        zh_cn: message,
      }),
    );

    sendClient?.im.message.create({
      data: {
        msg_type: 'post',
        receive_id: sendConfig.receiveId,
        content: JSON.stringify({
          zh_cn: message,
        }),
      },
      params: {
        receive_id_type: 'chat_id',
      },
    });
  });
};

export { sendMessage };
