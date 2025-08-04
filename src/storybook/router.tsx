import type { Decorator } from "@storybook/react-vite";
import {
  createMemoryHistory,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  interpolatePath,
  RouterProvider,
} from "@tanstack/react-router";
import type { RouterContext } from "@/routes/__root";
import type { FileRoutesByFullPath } from "@/routeTree.gen";
import type { Compute, HasRequiredKeys, IfMaybeUndefined } from "@/utils/types";
import { getStore } from "./decorators";

type RouteData = {
  [Path in keyof FileRoutesByFullPath]: Compute<
    {
      path: Path;
    } & IfMaybeUndefined<
      FileRoutesByFullPath[Path]["types"]["loaderData"],
      {
        loaderData?: FileRoutesByFullPath[Path]["types"]["loaderData"];
      },
      {
        loaderData: FileRoutesByFullPath[Path]["types"]["loaderData"];
      }
    > &
      HasRequiredKeys<
        FileRoutesByFullPath[Path]["types"]["params"],
        {
          params: FileRoutesByFullPath[Path]["types"]["params"];
        },
        {
          params?: FileRoutesByFullPath[Path]["types"]["params"];
        }
      >
  >;
}[keyof FileRoutesByFullPath];

export interface RouterParameters {
  router?: {
    currentRoute?: RouteData;
  };
}

declare module "@storybook/react-vite" {
  interface Parameters extends RouterParameters {}
}

const defaultRoute: RouteData = { path: "/" };

export const withRouter: Decorator = (Story, { parameters }) => {
  const { currentRoute = defaultRoute } = parameters.router ?? {};
  const rootRoute = createRootRouteWithContext<RouterContext>()({});
  const storyRoute = createRoute({
    component: Story,
    path: currentRoute.path,
    getParentRoute: () => rootRoute,
    loader: () => currentRoute.loaderData,
  });
  rootRoute.addChildren([storyRoute]);

  const router = createRouter({
    history: createMemoryHistory({
      initialEntries: currentRoute.params
        ? [
            interpolatePath({
              path: currentRoute.path,
              params: currentRoute.params,
            }).interpolatedPath,
          ]
        : [currentRoute.path],
      initialIndex: 0,
    }),
    routeTree: rootRoute,
    context: {
      store: getStore(parameters),
    },
  });
  return <RouterProvider router={router} />;
};
