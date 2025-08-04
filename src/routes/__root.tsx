import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Provider } from "react-redux";
import { SessionProvider } from "@/features/auth/session";
import type { AppStore } from "@/store";
import { store } from "@/store";
import { supabase } from "@/supabase";

export interface RouterContext {
  store: AppStore;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { title: "Ransom Notes" },
      {
        name: "description",
        content:
          "An online version of the excellent game Ransom Notes, made with TanStack Router and Supabase.",
      },
    ],
  }),
  loader: async () => ({
    initialSession: await supabase.auth
      .getSession()
      .then(({ data }) => data.session),
  }),
  component: RootComponent,
});

function RootComponent() {
  const { initialSession } = Route.useLoaderData();
  return (
    <SessionProvider initialSession={initialSession}>
      <Provider store={store}>
        <HeadContent />
        <Outlet />
        <Scripts />
        <TanStackRouterDevtools />
      </Provider>
    </SessionProvider>
  );
}
