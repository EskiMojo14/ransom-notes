import type { Decorator } from "@storybook/react-vite";
import { Provider } from "react-redux";
import { SessionProvider } from "@/features/auth/session";
import type { AppStore, PreloadedState } from "@/store";
import { makeStore } from "@/store";

export const withRedux: Decorator = (Story, { parameters }) => {
  const { preloadedState, store = makeStore(preloadedState) } =
    (parameters as ReduxParameters).redux ?? {};
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

export const withSession: Decorator = (Story) => (
  <SessionProvider>
    <Story />
  </SessionProvider>
);
