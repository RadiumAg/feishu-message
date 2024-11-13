// eslint-disable-next-line max-classes-per-file
type SendChatGroupConfig = {
  appId: string;
  chatId: string;
  chatName: string;
  appSecret: string;
  receiveId?: string;
};

type TGSendConfigArray = {
  botName: string;
  topicName: string;
  messageText: string;
};

type ListenChatGroupConfig = {
  feedId: string;
  chatName: string;
  userName?: string;
  tgSendConfigArray?: TGSendConfigArray[]; // telegram配置
  linkSendConfigArray?: SendChatGroupConfig[];
};

declare module '@larksuiteoapi/node-sdk' {
  export * from '@larksuiteoapi/node-sdk/types/index';
  import * as Lark from '@larksuiteoapi/node-sdk/types/index';

  class WSClient extends Lark.WSClient {
    config: ListenChatGroupConfig;
  }

  class Client extends Lark.Client {
    config: SendChatGroupConfig;
  }

  export { WSClient, Client };
}
