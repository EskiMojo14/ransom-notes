import type { Decorator } from "@storybook/react-vite";
import {
  createMemoryHistory,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  interpolatePath,
  Outlet,
  RouterProvider,
  type AnyRoute,
  type FileRoutesByPath,
  type RootRouteId,
} from "@tanstack/react-router";
import type { RouterContext } from "@/routes/__root";
import type { FileRoutesByFullPath } from "@/routeTree.gen";
import type { Compute, HasRequiredKeys, IfMaybeUndefined } from "@/utils/types";
import { getStore } from "./decorators";

type RouteDataFor<TPath extends keyof FileRoutesByPath> = {
  path: FileRoutesByPath[TPath]["path"];
} & IfMaybeUndefined<
  FileRoutesByPath[TPath]["preLoaderRoute"]["types"]["loaderData"],
  {
    loaderData?: FileRoutesByPath[TPath]["preLoaderRoute"]["types"]["loaderData"];
  },
  {
    loaderData: FileRoutesByPath[TPath]["preLoaderRoute"]["types"]["loaderData"];
  }
>;

type RoutesFor<
  TPath extends keyof FileRoutesByPath,
  TAcc extends Array<RouteDataFor<keyof FileRoutesByPath>> = [],
> = FileRoutesByPath[TPath]["parentRoute"]["id"] extends RootRouteId
  ? [RouteDataFor<TPath>, ...TAcc]
  : RoutesFor<
      FileRoutesByPath[TPath]["parentRoute"]["fullPath"],
      [RouteDataFor<TPath>, ...TAcc]
    >;

type RouteData = {
  [Path in keyof FileRoutesByFullPath]: Compute<
    {
      path: Path;
      routes: RoutesFor<Path>;
    } & HasRequiredKeys<
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

const defaultRoute: Extract<RouteData, { path: "/" }> = {
  path: "/",
  routes: [{ path: "/" }],
};

export const withRouter: Decorator = (Story, { parameters }) => {
  const { currentRoute: { path, routes, params } = defaultRoute } =
    parameters.router ?? {};
  const rootRoute = createRootRouteWithContext<RouterContext>()({});
  let parentRoute: AnyRoute = rootRoute;
  routes.forEach((route, idx) => {
    const parent = parentRoute;
    const newRoute = createRoute({
      path: route.path,
      getParentRoute: () => parent,
      loader: () => route.loaderData,
      component: idx === routes.length - 1 ? Story : Outlet,
    });
    parentRoute.addChildren([newRoute]);
    parentRoute = newRoute;
  });

  const initialPath = params
    ? interpolatePath({ path, params }).interpolatedPath
    : path;

  const router = createRouter({
    history: createMemoryHistory({
      initialEntries: [initialPath],
      initialIndex: 0,
    }),
    routeTree: rootRoute,
    context: {
      store: getStore(parameters),
    },
  });
  return <RouterProvider router={router} />;
};
