import { createFileRoute } from "@tanstack/react-router";
import { env } from "@/env";
import { ensureAuthenticated } from "@/features/auth/user";

export const Route = createFileRoute("/")({
  async beforeLoad() {
    if (!env.VITE_USE_MOCKS) await ensureAuthenticated();
  },
  component: App,
});

function App() {
  return null;
}
