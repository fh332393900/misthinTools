import path from 'path';
import { app, BrowserWindow, nativeImage, dialog, Menu, Tray, MenuItem, MenuItemConstructorOptions, ipcMain } from 'electron';
import config from '@/config';

const myGlobal = global as Global;
export default (win: BrowserWindow): void => {
  createTray(win);
  // app.whenReady().then(() => createTray(win));
  ipcMain.on('hideTray', () => removeTray());
  ipcMain.on('showTray', () => createTray(win));
};
// 创建tray
function createTray(win: BrowserWindow) {
  if (myGlobal._tray) return;
  myGlobal._tray = null; // 此变量保存Tray实例，需要用全局变量或挂载到其他全局对象上,否则会被回收
  const image = nativeImage.createFromPath(path.join(__static, 'images/trayTemplate.png'));
  image.setTemplateImage(true);
  myGlobal._tray = new Tray(image); //系统托盘图标
  const menuTemplate: Array<MenuItemConstructorOptions | MenuItem> = [
    {
      label: '关于',
      click() {
        dialog.showMessageBox({
          title: config.appTitle,
          message: config.appTitle,
          detail: `Version: ${config.appVersion}\nAuthor: ${config.appAuthor}\nGithub: ${config.repositoryUrl}`
        });
      }
    },
    {
      label: '显示控制台',
      type: 'radio',
      click: () => showWindow(win)
    },
    {
      label: '隐藏控制台',
      type: 'radio',
      click: () => hideWindow(win)
    },
    {
      role: 'quit',
      label: '退出'
    }
  ];
  const contextMenu = Menu.buildFromTemplate(menuTemplate);
  myGlobal._tray.setToolTip(config.appTitle); // 鼠标放上时候的提示
  // myGlobal._tray.setTitle('misthin');
  // 右键点击
  myGlobal._tray.on('right-click', () => {
    myGlobal._tray?.popUpContextMenu(contextMenu); // 应用菜单项
  });
  // 左键点击
  myGlobal._tray.on('click', () => {
    showWindow(win);
  });
}
// 移除tray
function removeTray() {
  myGlobal._tray?.destroy();
  myGlobal._tray = null;
}
// 隐藏窗口
function hideWindow(win: BrowserWindow) {
  win.hide();
}
// 显示窗口
function showWindow(win: BrowserWindow) {
  win.show();
}