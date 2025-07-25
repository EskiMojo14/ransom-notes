import type { Decorator, Parameters } from "@storybook/react-vite";
import { Provider } from "react-redux";
import { SessionProvider } from "@/features/auth/session";
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

export const withSession: Decorator = (Story) => (
  <SessionProvider>
    <Story />
  </SessionProvider>
);
