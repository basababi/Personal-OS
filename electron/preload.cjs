const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('pos', {
  loadData: () => ipcRenderer.invoke('data:load'),
  saveData: (data) => ipcRenderer.send('data:save', data),
  exportData: () => ipcRenderer.invoke('data:export'),
  importData: () => ipcRenderer.invoke('data:import'),
  getAutoLaunch: () => ipcRenderer.invoke('autolaunch:get'),
  setAutoLaunch: (b) => ipcRenderer.invoke('autolaunch:set', b),
  testNotify: () => ipcRenderer.send('notify:test'),
  appInfo: () => ipcRenderer.invoke('app:info'),
  onNavigate: (cb) => {
    const fn = (_e, view) => cb(view);
    ipcRenderer.on('navigate', fn);
    return () => ipcRenderer.removeListener('navigate', fn);
  },
  onRemindersEnabled: (cb) => {
    const fn = (_e, val) => cb(val);
    ipcRenderer.on('reminders-enabled', fn);
    return () => ipcRenderer.removeListener('reminders-enabled', fn);
  },
  onShotTheme: (cb) => {
    const fn = (_e, theme) => cb(theme);
    ipcRenderer.on('shot-theme', fn);
    return () => ipcRenderer.removeListener('shot-theme', fn);
  }
});
