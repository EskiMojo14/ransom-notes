import type { Decorator } from "@storybook/react-vite";
import { Provider } from "react-redux";
import { SessionProvider } from "@/features/auth/session";
import type { AppStore, PreloadedState } from "@/store";
import { makeStore } from "@/store";

export const withRedux =
  ({
    preloadedState,
    store = makeStore(preloadedState),
  }: {
    preloadedState?: PreloadedState;
    store?: AppStore;
  } = {}): Decorator =>
  // eslint-disable-next-line react/display-name
  (Story) => (
    <Provider store={store}>
      <Story />
    </Provider>
  );

export const withSession: Decorator = (Story) => (
  <SessionProvider>
    <Story />
  </SessionProvider>
);
