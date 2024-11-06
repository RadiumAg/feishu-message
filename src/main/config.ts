import * as Lark from '@larksuiteoapi/node-sdk';

type GlobalConfig = {
  listenChatGroupClientArray: Lark.WSClient[];
  // eslint-disable-next-line no-undef
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
