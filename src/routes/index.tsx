import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/supabase";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  function signInWithGithub() {
    void supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: window.location.origin + "/auth/callback",
      },
    });
  }
  return (
    <>
      <button type="button" onClick={signInWithGithub}>
        Sign in with Github
      </button>
    </>
  );
}
