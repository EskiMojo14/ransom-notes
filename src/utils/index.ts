import { createStore } from "safeway";
import type * as v from "valibot";
import type { AppThunk, RootState } from "@/store";

export const createLocalAndDataStore = <
  T extends v.GenericSchema<string, string>,
>(
  key: string,
  schema: T,
) =>
  createStore(key, schema, {
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

export function specify<T>(_value: T): asserts _value is T {
  // no-op
}

export const safeAssign: <T>(target: T, ...sources: Array<Partial<T>>) => T =
  Object.assign;

export const string = {
  toUpperCase<T extends string>(value: T) {
    return value.toUpperCase() as Uppercase<T>;
  },
  toLowerCase<T extends string>(value: T) {
    return value.toLowerCase() as Lowercase<T>;
  },
};

export const unsafeEntries: <T extends object>(
  obj: T,
) => Array<{ [K in keyof T]: [K, T[K]] }[keyof T]> = Object.entries;
export const unsafeKeys: <T extends object>(obj: T) => Array<keyof T> =
  Object.keys;

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
export function getOrInsert<K extends object, V>(
  map: WeakMap<K, V>,
  key: K,
  value: V,
): V;
export function getOrInsert<K, V>(map: Map<K, V>, key: K, value: V): V;
export function getOrInsert<K extends object, V>(
  map: Map<K, V> | WeakMap<K, V>,
  key: K,
  value: V,
): V {
  if (map.has(key)) return map.get(key) as V;

  return map.set(key, value).get(key) as V;
}

export function getOrInsertComputed<K extends object, V>(
  map: WeakMap<K, V>,
  key: K,
  compute: (key: K) => V,
): V;
export function getOrInsertComputed<K, V>(
  map: Map<K, V>,
  key: K,
  compute: (key: K) => V,
): V;
export function getOrInsertComputed<K extends object, V>(
  map: Map<K, V> | WeakMap<K, V>,
  key: K,
  compute: (key: K) => V,
): V {
  if (map.has(key)) return map.get(key) as V;

  return map.set(key, compute(key)).get(key) as V;
}
