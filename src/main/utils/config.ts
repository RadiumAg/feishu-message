import { ipcMain } from 'electron';
import ElectronLog from 'electron-log';
import fs from 'fs/promises';
import path from 'path';
import { electron } from 'process';

const configPath = path.join(__dirname, 'config.json');

type GlobalConfig = {
  // eslint-disable-next-line no-undef
  listenChatGroupConfigArray: ListenChatGroupConfig[];
};

const globalConfig: GlobalConfig = {
  listenChatGroupConfigArray: [],
};

const setConfig = (globalConfigValue: Partial<GlobalConfig>) => {
  Object.assign(globalConfig, globalConfigValue);

  try {
    fs.writeFile(configPath, JSON.stringify(globalConfig));
  } catch (e) {
    ElectronLog.log('setConfigError', JSON.stringify(e));
  }
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

export { setConfig, globalConfig, getConfig };
export type { GlobalConfig };
