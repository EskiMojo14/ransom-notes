import { createFileRoute } from "@tanstack/react-router";
import { GithubSignin } from "@/features/auth/GithubSignin";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <GithubSignin />
    </div>
  );
}
