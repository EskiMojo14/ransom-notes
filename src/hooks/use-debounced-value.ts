import { useEffect, useState } from "react";
import { useDevDebugValue } from "./use-dev-debug-value";

export function useDebouncedValue<T>(incomingValue: T, ms = 300) {
  const [value, setValue] = useState(incomingValue);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setValue(incomingValue);
    }, ms);
    return () => {
      clearTimeout(timeout);
    };
  }, [incomingValue, ms]);
  useDevDebugValue(value);
  return value;
}
