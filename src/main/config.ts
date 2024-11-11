type GlobalConfig = {
  // eslint-disable-next-line no-undef
  listenChatGroupConfigArray: ListenChatGroupConfig[];
};

const globalConfig: GlobalConfig = {
  listenChatGroupConfigArray: [],
};

const setConfig = (globalConfigValue: Partial<GlobalConfig>) => {
  Object.assign(globalConfig, globalConfigValue);
};

export { setConfig, globalConfig };
export type { GlobalConfig };
