import * as Lark from '@larksuiteoapi/node-sdk';

type ListenChatGroupConfig = {
  appId: string;
  appSecret: string;
  linkSendAppId?: string[];
};

type SendChatGroupConfig = {
  appId: string;
  appSecret: string;
  receiveId?: string;
};

type GlobalConfig = {
  sendChatGroupClientArray: Lark.Client[];
  sendChatGroupConfigArray: SendChatGroupConfig[];
  listenChatGroupClientArray: Lark.WSClient[];
  listenChatGroupConfigArray: ListenChatGroupConfig[];
};

const globalConfig: GlobalConfig = {
  sendChatGroupConfigArray: [],
  sendChatGroupClientArray: [],
  listenChatGroupConfigArray: [],
  listenChatGroupClientArray: [],
};

const setConfig = (globalConfigValue: Partial<GlobalConfig>) => {
  Object.assign(globalConfig, globalConfigValue);
};

export { setConfig, globalConfig };
