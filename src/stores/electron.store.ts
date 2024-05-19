import { BrowserWindow, Menu } from "electron";
import { makeAutoObservable } from "mobx";
import path from "node:path";
import { initializeIPC } from "../electron/ipcMain";
import { initAutoUpdater } from "../electron/lib/autoUpdater";
import {
  VITE_PUBLIC,
  isDev,
  ELECTRON_DIST_PATH,
  VITE_DEV_SERVER_URL,
  RENDERER_DIST,
} from "../lib/configs";

class ElectronStore {
  mainWindow: BrowserWindow | null = null;
  constructor() {
    makeAutoObservable(this);
  }

  initialize() {
    this.createWindow();
  }

  createWindow() {
    this.mainWindow = new BrowserWindow({
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

    initAutoUpdater();

    // Set Menu
    Menu.setApplicationMenu(null);

    if (isDev) {
      this.mainWindow.webContents.openDevTools();
    }

    // Test active push message to Renderer-process.
    this.mainWindow.webContents.on("did-finish-load", () => {
      if (!this.mainWindow) return console.error("Window not created");
      this.mainWindow.webContents.send(
        "main-process-message",
        new Date().toLocaleString()
      );
      initializeIPC();
    });

    if (VITE_DEV_SERVER_URL) {
      this.mainWindow.loadURL(VITE_DEV_SERVER_URL);
    } else {
      // win.loadFile('dist/index.html')
      this.mainWindow.loadFile(path.join(RENDERER_DIST, "index.html"));
    }
  }
}

export const electronStore = new ElectronStore();
