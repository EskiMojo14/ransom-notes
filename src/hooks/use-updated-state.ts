import { useState } from "react";
import { useDevDebugValue } from "./use-dev-debug-value";

export function useUpdatedState<T>(initialState: T) {
  const [state, setState] = useState(initialState);
  if (state !== initialState) {
    setState(initialState);
  }
  useDevDebugValue(state);
  return [state, setState] as const;
}
