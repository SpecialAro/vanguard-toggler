import { BrowserWindow, app, dialog, ipcMain } from "electron";
import fs from "fs-extra";
import { join } from "node:path";
import * as shutdown from "electron-shutdown-command";
import findProcess from "find-process";

const VANGUARD_PATH = "C:\\Program Files\\Riot Vanguard";
const VGTRAY_ON = join(VANGUARD_PATH, "vgtray.exe");
const VGTRAY_OFF = join(VANGUARD_PATH, "vgtray_off.exe");
const VGK_ON = join(VANGUARD_PATH, "vgk.sys");
const VGK_OFF = join(VANGUARD_PATH, "vgk_off.sys");

function initializeIPC(win: BrowserWindow) {
  ipcMain.on("renderer-process-message", (event, arg) => {
    console.log(arg);
    event.reply("main-process-reply", "Hello from main process!");
  });

  initializeAppIPC(win);

  vanguardIPC();
}

function initializeAppIPC(win: BrowserWindow) {
  ipcMain.on("initialized-renderer-process", () => {
    console.log("Renderer process initialized!");
  });
  win.webContents.send("window:app-initialized", { version: app.getVersion() });
}

function vanguardIPC() {
  ipcMain.handle("vanguard:get-status", async () => {
    let status: string | null = null;
    try {
      const vgk = await fs.exists(VGK_ON);
      const vgkOff = await fs.exists(VGK_OFF);

      if (vgk && !vgkOff) {
        status = "running";
      } else if (!vgk && vgkOff) {
        status = "stopped";
      } else {
        status = "error";
      }
    } catch (error) {
      console.error(error);
      status = "error";
    }

    return status;
  });

  ipcMain.handle("vanguard:toggle", async (_, data) => {
    const { status } = data;

    const wantsRestart = await dialog.showMessageBox({
      title: "Restart required",
      message:
        "You need to restart your computer for the changes to take effect",
      type: "warning",
      buttons: ["Restart later", "Restart now"],
    });

    const restart = wantsRestart.response === 1;

    if (status === "running") {
      findProcess("name", "Riot Vanguard").then((list) => {
        if (list.length > 0) {
          console.log("Killing Vanguard process");
          process.kill(list[0].pid, "SIGKILL");
        }
      });
    }

    let result: boolean | null = null;
    try {
      if (status === "running") {
        await fs.rename(VGTRAY_ON, VGTRAY_OFF);
        await fs.rename(VGK_ON, VGK_OFF);
        result = true;
      }

      if (status === "stopped") {
        await fs.rename(VGTRAY_OFF, VGTRAY_ON);
        await fs.rename(VGK_OFF, VGK_ON);
        result = true;
      }

      if (restart) {
        // Schedule a restart
        shutdown.reboot();
        app.quit();
      }
    } catch {
      console.error("Error toggling Vanguard");
      result = false;
    }

    return result;
  });
}

export { initializeIPC };
