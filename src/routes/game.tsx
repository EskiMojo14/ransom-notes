import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/game")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
