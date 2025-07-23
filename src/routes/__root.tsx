import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Provider } from "react-redux";
import { SessionProvider } from "@/features/auth/session";
import type { AppStore } from "@/store";
import { store } from "@/store";

export const Route = createRootRouteWithContext<{ store: AppStore }>()({
  component: () => (
    <SessionProvider>
      <Provider store={store}>
        <Outlet />
        <TanStackRouterDevtools />
      </Provider>
    </SessionProvider>
  ),
});
