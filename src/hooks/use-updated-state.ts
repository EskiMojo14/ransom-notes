import { useState } from "react";

export function useUpdatedState<T>(initialState: T) {
  const [state, setState] = useState(initialState);
  if (state !== initialState) {
    setState(initialState);
  }
  return [state, setState] as const;
}
