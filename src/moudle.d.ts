// eslint-disable-next-line max-classes-per-file
type FSSendConfig = {
  appId: string;
  chatId: string;
  chatName: string;
  appSecret: string;
  receiveId: string;
};

type TGSendConfigArray = {
  botName: string;
  topicName: string;
  isSendImg: boolean;
};

type ListenChatGroupConfig = {
  id: string;
  tagFeedId: string;
  feedId: string;
  chatName: string;
  userName?: string;
  tgSendConfigArray?: TGSendConfigArray[]; // telegram配置
  fsSendConfigArray?: FSSendConfig[];
};

declare module '@larksuiteoapi/node-sdk' {
  export * from '@larksuiteoapi/node-sdk/types/index';
  import * as Lark from '@larksuiteoapi/node-sdk/types/index';

  class WSClient extends Lark.WSClient {
    config: ListenChatGroupConfig;
  }

  class Client extends Lark.Client {
    config: FSSendConfig;
  }

  export { WSClient, Client };
}
