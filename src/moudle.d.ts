// eslint-disable-next-line max-classes-per-file
type SendChatGroupConfig = {
  appId: string;
  chatId: string;
  chatName: string;
  appSecret: string;
  receiveId?: string;
};

type ListenChatGroupConfig = {
  feedId: string;
  chatName: string;
  linkSendConfigArray: SendChatGroupConfig[];
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
