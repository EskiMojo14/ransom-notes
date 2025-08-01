import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { env } from "./env";
import { routeTree } from "./routeTree.gen";
import { store } from "./store";

// Import the generated route tree

import "./styles.css";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    store,
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

async function enableMocking() {
  if (!env.VITE_USE_MOCKS) return;
  const { worker } = await import("./mocks/browser");
  return worker.start();
}

enableMocking()
  .then(() => {
    // Render the app
    const rootElement = document.getElementById("app");
    if (rootElement && !rootElement.innerHTML) {
      const root = createRoot(rootElement);
      root.render(
        <StrictMode>
          <RouterProvider router={router} />
        </StrictMode>,
      );
    }
  })
  .catch(console.error);
