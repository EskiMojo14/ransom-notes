import { buildStoreCreator } from "safeway";

export const createLocalAndDataStore = buildStoreCreator({
  storage: {
    getItem(key) {
      const local = localStorage.getItem(key);
      if (local != null) {
        // make sure to set it in data store as well
        this.setItem(key, local);
        return local;
      }
      return document.documentElement.dataset[key];
    },
    setItem(key, value) {
      localStorage.setItem(key, value);
      // in setItem, value is already stringified - we need to parse it
      document.documentElement.dataset[key] = JSON.parse(value) as string;
    },
    removeItem(key) {
      localStorage.removeItem(key);
    },
  },
});
