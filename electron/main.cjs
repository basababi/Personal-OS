// Personal OS — Electron main process.
// Үүрэг: цонх + tray, өгөгдлийг диск дээр хадгалах, сануулгын хуваарьлагч,
// Windows автоматаар асаах, export/import.
const { app, BrowserWindow, Tray, Menu, Notification, ipcMain, dialog, nativeImage, shell } = require('electron');
const path = require('path');
const fs = require('fs');

const APP_ROOT = path.join(__dirname, '..');
const IS_DEV = !app.isPackaged;
// Packaged үед assets нь asar-аас гадуур (asarUnpack) байрлана —
// Tray/Notification-д диск дээрх жинхэнэ файлын зам хэрэгтэй
const ASSETS = IS_DEV
  ? path.join(APP_ROOT, 'assets')
  : path.join(APP_ROOT, 'assets').replace(path.sep + 'app.asar' + path.sep, path.sep + 'app.asar.unpacked' + path.sep);
const SHOT_ARG = process.argv.find(a => a.startsWith('--shot='));
const AUTOSTART = process.argv.includes('--autostart');

// Windows toast мэдэгдэл dev горимд ажиллуулахад заавал хэрэгтэй
if (process.platform === 'win32') app.setAppUserModelId(IS_DEV ? process.execPath : 'mn.basbish.personalos');

// Өгөгдөл тогтмол байрлалд — package нэрээс хамаарахгүй
app.setPath('userData', path.join(app.getPath('appData'), 'PersonalOS'));
const DATA_FILE = path.join(app.getPath('userData'), 'data.json');
const STATE_FILE = path.join(app.getPath('userData'), 'window-state.json');

let win = null;
let tray = null;
let dataCache = null;      // сануулгын нөхцөл шалгахад ашиглана
let quitting = false;
const firedToday = new Map(); // reminderId -> 'YYYY-MM-DD'

// ── Өгөгдөл ──────────────────────────────────────────────────────────────
function loadDataFile() {
  try {
    if (fs.existsSync(DATA_FILE)) return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) { console.error('data load failed:', e.message); }
  return null;
}

let lastBackupDate = '';
function saveDataFile(data) {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    const today = localDate();
    // Өдөрт нэг удаа өмнөх хувилбарыг backup-д хуулна
    if (lastBackupDate !== today && fs.existsSync(DATA_FILE)) {
      fs.copyFileSync(DATA_FILE, DATA_FILE.replace(/\.json$/, '.backup.json'));
      lastBackupDate = today;
    }
    const tmp = DATA_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(data));
    fs.renameSync(tmp, DATA_FILE);
    dataCache = data;
  } catch (e) { console.error('data save failed:', e.message); }
}

function localDate(off = 0) {
  const d = new Date(Date.now() + off * 86400000);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

// ── Цонх ─────────────────────────────────────────────────────────────────
function loadWinState() {
  try { return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); } catch { return {}; }
}
function saveWinState() {
  if (!win) return;
  try {
    const b = win.getBounds();
    fs.writeFileSync(STATE_FILE, JSON.stringify({ ...b, max: win.isMaximized() }));
  } catch { /* ignore */ }
}

function createWindow() {
  const st = loadWinState();
  win = new BrowserWindow({
    width: st.width || 1320,
    height: st.height || 860,
    x: st.x, y: st.y,
    minWidth: 960,
    minHeight: 640,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#F2EFE8',
    icon: path.join(ASSETS, 'icon.png'),
    title: 'Personal OS',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false
    }
  });
  win.removeMenu();

  if (process.env.VITE_DEV_SERVER_URL) win.loadURL(process.env.VITE_DEV_SERVER_URL);
  else win.loadFile(path.join(APP_ROOT, 'dist', 'index.html'));

  if (st.max) win.maximize();

  win.once('ready-to-show', () => {
    if (!AUTOSTART || SHOT_ARG) win.show();
  });

  // Хаах товч → tray руу нуугдана (тохиргоогоор өөрчилж болно)
  win.on('close', (e) => {
    saveWinState();
    const closeToTray = dataCache?.settings?.closeToTray !== false;
    if (!quitting && closeToTray && !SHOT_ARG) {
      e.preventDefault();
      win.hide();
    }
  });
  win.on('closed', () => { win = null; });

  // Гадаад линкийг браузераар нээнэ
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) shell.openExternal(url);
    return { action: 'deny' };
  });
}

function showWindow(view) {
  if (!win) createWindow();
  else {
    if (win.isMinimized()) win.restore();
    win.show();
    win.focus();
  }
  if (view && win) win.webContents.send('navigate', view);
}

// ── Tray ─────────────────────────────────────────────────────────────────
function buildTrayMenu() {
  const remindersOn = dataCache?.reminders?.enabled !== false;
  return Menu.buildFromTemplate([
    { label: 'Personal OS нээх', click: () => showWindow() },
    { type: 'separator' },
    { label: 'Хяналтын самбар', click: () => showWindow('home') },
    { label: 'Өдрийн төлөвлөгч', click: () => showWindow('planner') },
    { label: 'MLOps төв', click: () => showWindow('mlops') },
    { label: 'English OS', click: () => showWindow('english') },
    { label: 'Зорилго ба Хэвшил', click: () => showWindow('goals') },
    { type: 'separator' },
    {
      label: 'Сануулга идэвхтэй', type: 'checkbox', checked: remindersOn,
      click: (item) => {
        if (dataCache && dataCache.reminders) {
          dataCache.reminders.enabled = item.checked;
          saveDataFile(dataCache);
          if (win) win.webContents.send('reminders-enabled', item.checked);
        }
      }
    },
    {
      label: 'Windows-тэй хамт асаах', type: 'checkbox', checked: getAutoLaunch(),
      click: (item) => setAutoLaunch(item.checked)
    },
    { type: 'separator' },
    { label: 'Гарах', click: () => { quitting = true; app.quit(); } }
  ]);
}

function createTray() {
  const img = nativeImage.createFromPath(path.join(ASSETS, 'tray.png'));
  tray = new Tray(img);
  tray.setToolTip('Personal OS — Mission Control');
  tray.setContextMenu(buildTrayMenu());
  tray.on('double-click', () => showWindow());
  tray.on('click', () => showWindow());
}

// ── Автоматаар асаах ─────────────────────────────────────────────────────
function autoLaunchConfig(enable) {
  // Dev горимд electron.exe + аппын зам; packaged үед exe өөрөө
  return IS_DEV
    ? { openAtLogin: enable, path: process.execPath, args: [APP_ROOT, '--autostart'] }
    : { openAtLogin: enable, args: ['--autostart'] };
}
function getAutoLaunch() {
  try { return app.getLoginItemSettings(autoLaunchConfig(true)).openAtLogin; } catch { return false; }
}
function setAutoLaunch(enable) {
  try { app.setLoginItemSettings(autoLaunchConfig(enable)); return getAutoLaunch(); } catch { return false; }
}

// ── Сануулгын хуваарьлагч ────────────────────────────────────────────────
// Ухаалаг нөхцөл: аль хэдийн хийчихсэн бол сануулахгүй
function smartSkip(rem, d) {
  if (!rem.smart || !d) return false;
  const today = localDate();
  try {
    if (rem.smart === 'routine') {
      return d.routine && d.routine.date === today && d.routine.items.every(Boolean);
    }
    if (rem.smart === 'english') {
      if (!d.engLog || d.engLog.date !== today) return false;
      const mins = Object.values(d.engLog.mins).reduce((a, b) => a + b, 0);
      return mins >= 30;
    }
    if (rem.smart === 'mlops') {
      return d.mlLog && d.mlLog.date === today && d.mlLog.mins >= 30;
    }
  } catch { /* ignore */ }
  return false;
}

function checkReminders() {
  const d = dataCache;
  if (!d || !d.reminders || d.reminders.enabled === false) return;
  const now = new Date();
  const hm = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
  const dow = (now.getDay() + 6) % 7; // Даваа=0 … Ням=6
  const today = localDate();
  for (const rem of d.reminders.items || []) {
    if (!rem.enabled || rem.time !== hm) continue;
    if (Array.isArray(rem.days) && rem.days.length && !rem.days.includes(dow)) continue;
    if (firedToday.get(rem.id) === today) continue;
    firedToday.set(rem.id, today);
    if (smartSkip(rem, d)) continue;
    fireNotification(rem.title, rem.body, rem.view);
  }
}

function fireNotification(title, body, view) {
  if (!Notification.isSupported()) return;
  const n = new Notification({
    title,
    body: body || '',
    icon: path.join(ASSETS, 'icon.png'),
    silent: false
  });
  n.on('click', () => showWindow(view || 'home'));
  n.show();
}

// ── Скриншот горим (--shot=dir) — би өөрөө UI-гаа шалгахад ашиглана ──────
async function takeShots() {
  const outDir = path.resolve(APP_ROOT, SHOT_ARG.split('=')[1] || 'shots');
  fs.mkdirSync(outDir, { recursive: true });
  const views = ['home', 'planner', 'mlops', 'english', 'goals', 'settings'];
  await new Promise(r => setTimeout(r, 1600));
  for (const v of views) {
    win.webContents.send('navigate', v);
    await new Promise(r => setTimeout(r, 900));
    const img = await win.webContents.capturePage();
    fs.writeFileSync(path.join(outDir, v + '.png'), img.toPNG());
  }
  // dark горимын нэг кадр
  win.webContents.send('shot-theme', 'dark');
  await new Promise(r => setTimeout(r, 700));
  win.webContents.send('navigate', 'home');
  await new Promise(r => setTimeout(r, 700));
  const img = await win.webContents.capturePage();
  fs.writeFileSync(path.join(outDir, 'home-dark.png'), img.toPNG());
  win.webContents.send('shot-theme', 'light'); // хэрэглэгчийн theme-ийг буцаана
  await new Promise(r => setTimeout(r, 400));
  console.log('shots →', outDir);
  quitting = true;
  app.quit();
}

// ── IPC ──────────────────────────────────────────────────────────────────
ipcMain.handle('data:load', () => {
  if (!dataCache) dataCache = loadDataFile();
  return dataCache;
});
ipcMain.on('data:save', (_e, data) => {
  saveDataFile(data);
  if (tray) tray.setContextMenu(buildTrayMenu());
});
ipcMain.handle('data:export', async () => {
  const { filePath } = await dialog.showSaveDialog(win, {
    title: 'Өгөгдөл хадгалах',
    defaultPath: 'PersonalOS-backup-' + localDate() + '.json',
    filters: [{ name: 'JSON', extensions: ['json'] }]
  });
  if (!filePath) return null;
  fs.writeFileSync(filePath, JSON.stringify(dataCache, null, 2));
  return filePath;
});
ipcMain.handle('data:import', async () => {
  const { filePaths } = await dialog.showOpenDialog(win, {
    title: 'Өгөгдөл сэргээх',
    filters: [{ name: 'JSON', extensions: ['json'] }],
    properties: ['openFile']
  });
  if (!filePaths || !filePaths[0]) return null;
  try { return JSON.parse(fs.readFileSync(filePaths[0], 'utf8')); }
  catch { return { __error: 'Файлыг уншиж чадсангүй — JSON биш байна.' }; }
});
ipcMain.handle('autolaunch:get', () => getAutoLaunch());
ipcMain.handle('autolaunch:set', (_e, enable) => setAutoLaunch(!!enable));
ipcMain.on('notify:test', () => fireNotification('Personal OS', 'Сануулга ажиллаж байна ✓ Систем чинь чамтай хамт.', 'home'));
ipcMain.handle('app:info', () => ({
  version: app.getVersion(),
  dataFile: DATA_FILE,
  isDev: IS_DEV
}));

// ── Lifecycle ────────────────────────────────────────────────────────────
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => showWindow());

  app.whenReady().then(() => {
    dataCache = loadDataFile();
    createWindow();
    if (!SHOT_ARG) createTray();
    setInterval(checkReminders, 20000);
    checkReminders();
    if (SHOT_ARG) win.webContents.once('did-finish-load', () => takeShots());
  });

  app.on('before-quit', () => { quitting = true; saveWinState(); });
  app.on('window-all-closed', () => {
    // Tray-д амьд үлдэнэ (сануулга ажиллуулахын тулд); shot горим болон
    // "хаахад tray-д үлдэхгүй" тохиргоотой үед бүрэн гарна
    if (SHOT_ARG || quitting || dataCache?.settings?.closeToTray === false) app.quit();
  });
}
