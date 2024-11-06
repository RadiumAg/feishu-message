import * as Lark from '@larksuiteoapi/node-sdk';

type SendChatGroupConfig = {
  appId: string;
  chatId: string;
  chatName: string;
  appSecret: string;
  receiveId?: string;
};

type ListenChatGroupConfig = {
  appId: string;
  chatId: string;
  chatName: string;
  appSecret: string;
  linkSendConfigArray: SendChatGroupConfig[];
};

type GlobalConfig = {
  listenChatGroupClientArray: Lark.WSClient[];
  listenChatGroupConfigArray: ListenChatGroupConfig[];
};

const globalConfig: GlobalConfig = {
  listenChatGroupConfigArray: [],
  listenChatGroupClientArray: [],
};

const setConfig = (globalConfigValue: Partial<GlobalConfig>) => {
  Object.assign(globalConfig, globalConfigValue);
};

export { setConfig, globalConfig };
export type { GlobalConfig };
