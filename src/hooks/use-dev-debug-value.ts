import { useDebugValue } from "react";

export const useDevDebugValue = import.meta.env.DEV
  ? useDebugValue
  : () => {
      // noop
    };
