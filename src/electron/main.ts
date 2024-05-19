import { app, BrowserWindow, Menu } from "electron";
import path from "node:path";
import { initializeIPC } from "./ipcMain";
import { ELECTRON_DIST_PATH, isDev, RENDERER_DIST, VITE_DEV_SERVER_URL, VITE_PUBLIC } from "../lib/configs";
import { initAutoUpdater } from "./lib/autoUpdater";
let win: BrowserWindow | null = null;

function appReady() {
  createWindow();
}

function createWindow() {
  win = new BrowserWindow({
    width: 600,
    height: 300,
    resizable: false,
    fullscreenable: false,
    icon: path.join(VITE_PUBLIC, "vanguard-toggler.png"),
    webPreferences: {
      devTools: isDev,
      preload: path.join(ELECTRON_DIST_PATH, "preload.mjs"),
    },
  });

  initAutoUpdater(win);

  // Set Menu
  Menu.setApplicationMenu(null);

  if (isDev) {
    win.webContents.openDevTools();
  }

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    if(!win) return console.error("Window not created");
    win.webContents.send("main-process-message", new Date().toLocaleString());
    initializeIPC(win);
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(appReady);
