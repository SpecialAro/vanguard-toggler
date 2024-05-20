import { makeAutoObservable } from "mobx";

export class AppStore {
  loading = true;

  version: string | null = null;

  theme: "dark" | "light" = "dark";

  get isDarkTheme() {
    return this.theme === "dark";
  }

  constructor() {
    makeAutoObservable(this);
  }

  initialize() {
    this.version = window.app?.version || null;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setTheme(theme: "dark" | "light") {
    this.theme = theme;
  }
}
