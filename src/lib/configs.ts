import path from "node:path";
import { fileURLToPath } from "node:url";

export const isDev = import.meta.env.DEV;

// ------------------- VITE CONFIGS -------------------
export const ELECTRON_DIST_PATH = path.dirname(fileURLToPath(import.meta.url));

export const APP_ROOT = path.join(ELECTRON_DIST_PATH, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(APP_ROOT, "dist");

export const VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(APP_ROOT, "public")
  : RENDERER_DIST;
// ------------------- VITE CONFIGS END -------------------