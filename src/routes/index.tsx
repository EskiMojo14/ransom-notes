import { createFileRoute } from "@tanstack/react-router";
import { GithubSignin } from "@/features/auth/GithubSignin";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <>
      <GithubSignin />
    </>
  );
}
