import type { Decorator } from "@storybook/react-vite";
import type { Session } from "@supabase/supabase-js";
import { assert } from "es-toolkit";
import type { MswParameters } from "msw-storybook-addon";
import { Provider } from "react-redux";
import { OriginalSessionProvider } from "@/features/auth/session";
import type { AppStore, PreloadedState } from "@/store";
import { makeStore } from "@/store";
import type { StripIndexSignature } from "@/utils/types";

export const withRedux: Decorator = (Story, { parameters }) => {
  const { preloadedState, store = makeStore(preloadedState) } =
    parameters.redux ?? {};
  (parameters.redux ??= {}).store = store;
  return (
    <Provider store={store}>
      <Story />
    </Provider>
  );
};

export interface ReduxParameters {
  redux?: {
    preloadedState?: PreloadedState;
    store?: AppStore;
  };
}

export function getStore(parameters: ReduxParameters): AppStore {
  const { redux: { store } = {} } = parameters;
  assert(store, "Store should exist, have you added the withRedux decorator?");
  return store;
}

export interface SessionParameters {
  session?: Session;
}

export function getSession(parameters: SessionParameters): Session {
  const { session } = parameters;
  assert(
    session,
    "Session should exist, have you added the withSession decorator and set the session?",
  );
  return session;
}

export const withSession: Decorator = (
  Story,
  { parameters: { session = null } },
) => (
  <OriginalSessionProvider {...{ session }}>
    <Story />
  </OriginalSessionProvider>
);

declare module "@storybook/react-vite" {
  interface Parameters
    extends ReduxParameters,
      SessionParameters,
      StripIndexSignature<MswParameters> {}
}
