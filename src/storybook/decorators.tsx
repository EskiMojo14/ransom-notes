import type { Decorator, Parameters } from "@storybook/react-vite";
import type { Session } from "@supabase/supabase-js";
import { assert } from "es-toolkit";
import { Provider } from "react-redux";
import { OriginalSessionProvider } from "@/features/auth/session";
import type { AppStore, PreloadedState } from "@/store";
import { makeStore } from "@/store";
import { specify } from "@/utils";

export const withRedux: Decorator = (Story, { parameters }) => {
  specify<ReduxParameters>(parameters);
  const { preloadedState, store = makeStore(preloadedState) } =
    parameters.redux ?? {};
  (parameters.redux ??= {}).store = store;
  return (
    <Provider store={store}>
      <Story />
    </Provider>
  );
};

export interface ReduxParameters extends Parameters {
  redux?: {
    preloadedState?: PreloadedState;
    store?: AppStore;
  };
}

export function getStore(parameters: ReduxParameters): AppStore {
  const { store } = parameters.redux ?? {};
  assert(store, "Store should exist, have you added the withRedux decorator?");
  return store;
}

export interface SessionParameters extends Parameters {
  session?: Session;
}

export function getNullableSession(
  parameters: SessionParameters,
): Session | null {
  const { session = null } = parameters;
  return session;
}

export function getSession(parameters: SessionParameters): Session {
  const session = getNullableSession(parameters);
  assert(
    session,
    "Session should exist, have you added the withSession decorator and set the session?",
  );
  return session;
}

export const withSession: Decorator = (Story, { parameters }) => (
  <OriginalSessionProvider session={getNullableSession(parameters)}>
    <Story />
  </OriginalSessionProvider>
);
