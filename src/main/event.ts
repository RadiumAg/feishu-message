import { ipcMain } from 'electron';
import { GlobalConfig, setConfig } from './config';

ipcMain.on('set-config', (_, globalConfig: GlobalConfig) => {
  setConfig(globalConfig);
});
