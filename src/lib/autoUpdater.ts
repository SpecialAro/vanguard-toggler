import { app, dialog } from "electron";
import { autoUpdater } from "electron-updater";
import { electronStore } from "../stores/electron.store";

export function initAutoUpdater() {
  if (!app.isPackaged) {
    return;
  }

  autoUpdater.checkForUpdates();

  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, 60_000);

  autoUpdater.on("checking-for-update", () => {
    console.log("Checking for update");
  });

  autoUpdater.on("update-downloaded", (_event: any) => {
    const dialogOpts: Electron.MessageBoxOptions = {
      type: "info",
      buttons: ["Restart app later", "Restart app now"],
      title: "Application Update",
      message: "A new version has been downloaded. Restart the application to apply the updates.",
    };

    dialog.showMessageBox(electronStore.mainWindow!, dialogOpts).then((returnValue) => {
      if (returnValue.response === 1) autoUpdater.quitAndInstall();
    });
  });

  autoUpdater.on("error", (message) => {
    console.error("There was a problem updating the application");
    console.error(message);
  });
}
