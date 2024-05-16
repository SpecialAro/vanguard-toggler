import { makeAutoObservable } from "mobx";

export class AppStore {
  loading = true;

  version: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  initialize() {
    this.version = window.app?.version || null;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }
}
