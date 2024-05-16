import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/main.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Use contextBridge
window.ipcRenderer.on("main-process-message", () => {
  window.ipcRenderer.send("initialized-renderer-process");
});

window.ipcRenderer.on("window:app", (_event, data) => {
  window.app = data;
});
