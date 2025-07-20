import { debounce } from "lodash";
import type { SetStateAction } from "react";
import { useMemo } from "react";
import { useUpdatedState } from "./use-updated-state";

const isSetter = <T>(value: SetStateAction<T>): value is (prev: T) => T =>
  typeof value === "function";

export function useDebouncedSync<T>(
  incoming: T,
  onSync: (value: T) => void,
  ms = 300,
) {
  const [state, setImmediately] = useUpdatedState(incoming);
  const debouncedSync = useMemo(() => debounce(onSync, ms), [onSync, ms]);
  function setDebounced(value: SetStateAction<T>) {
    setImmediately((prev) => {
      const newValue = isSetter(value) ? value(prev) : value;
      debouncedSync(newValue);
      return newValue;
    });
  }
  return [state, setDebounced, setImmediately] as const;
}
