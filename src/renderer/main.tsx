import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/main.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { stores } from "../lib/stores.ts";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Use contextBridge
window.ipcRenderer.on("main-process-message", () => {
  window.ipcRenderer.send("initialized-renderer-process");
});

window.ipcRenderer.on("window:app-initialized", (_event, data) => {
  window.app = data;

  // INITIALIZE STORES
  for (const store in stores) {
    stores[store as keyof typeof stores].initialize();
  }
  stores.app.setLoading(false);
});
