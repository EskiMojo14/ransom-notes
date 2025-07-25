import { buildStoreCreator } from "safeway";
import type { AppThunk, RootState } from "@/store";

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

export const selectFromState =
  <TSelected>(selector: (state: RootState) => TSelected): AppThunk<TSelected> =>
  (_dispatch, getState) =>
    selector(getState());

export const promiseFromEntries = async <V>(
  entries: Array<[key: string, value: V]>,
): Promise<Record<string, Awaited<V>>> =>
  Object.fromEntries(
    await Promise.all(
      entries.map(async ([key, value]) => [key, await value] as const),
    ),
  );

export const promiseOwnProperties = <T extends Record<string, unknown>>(
  obj: T,
): Promise<{ [K in keyof T]: Awaited<T[K]> }> =>
  promiseFromEntries(Object.entries(obj)) as never;

export function assert(
  condition: unknown,
  message?: string,
): asserts condition {
  if (!condition) throw new Error(message);
}
