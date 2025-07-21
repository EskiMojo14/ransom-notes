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
        redirectTo: new URL("/auth/callback", window.location.href).href,
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
