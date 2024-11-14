import ElectronLog from 'electron-log';
import fs from 'fs/promises';
import path from 'path';
import { FormValue } from '../../utils/type';

const configPath = path.join(__dirname, 'global.config.json');

type GlobalConfig = {
  // eslint-disable-next-line no-undef
  listenChatGroupConfigArray: ListenChatGroupConfig[];
};

const globalConfig: GlobalConfig = {
  listenChatGroupConfigArray: [],
};

const setConfig = (globalConfigValue: Partial<GlobalConfig>) => {
  Object.assign(globalConfig, globalConfigValue);

  fs.writeFile(configPath, JSON.stringify(globalConfig)).catch((e) => {
    ElectronLog.log('setConfigError', JSON.stringify(e));
  });
};

const getConfig = async () => {
  if (globalConfig.listenChatGroupConfigArray.length === 0) {
    const config = await fs.readFile(configPath);
    Object.assign(globalConfig, JSON.parse(config.toString()));
  }
  return globalConfig;
};

const initConfig = async () => {
  await getConfig();
};

/**
 * 将全局配置转换成表单配置
 *
 * @param {GlobalConfig} config
 * @return {*}  {FormValue}
 */
const transformToFormValue = (config: GlobalConfig): FormValue => {
  const formValue = config.listenChatGroupConfigArray.map<FormValue>(
    (listenConfig) => {
      const fsConfig =
        listenConfig.fsSendConfigArray?.map((sendConfigValue) => ({
          appId: sendConfigValue.appId,
          chatId: sendConfigValue.receiveId,
          appSecret: sendConfigValue.appSecret,
          chatName: sendConfigValue.chatName,
        })) || [];

      const tgConfig =
        listenConfig.tgSendConfigArray?.map((tgConfigValue) => ({
          botName: tgConfigValue.botName,
          topicName: tgConfigValue.topicName,
        })) || [];

      return {
        feedId: listenConfig.feedId,
        chatName: listenConfig.chatName,
        fsSendConfigArray: fsConfig,
        tgSendConfigArray: tgConfig,
      };
    },
  );

  return formValue;
};

export { setConfig, globalConfig, getConfig, initConfig, transformToFormValue };
export type { GlobalConfig };
