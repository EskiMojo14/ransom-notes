import { supabase } from "@/supabase";
import { useSession } from "./session";

export function GithubSignin() {
  const session = useSession();
  function signInWithGithub() {
    void supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: new URL("/auth/callback", window.location.href).href,
      },
    });
  }
  if (session) {
    return <span>{session.user.user_metadata.user_name}</span>;
  }
  return (
    <button type="button" onClick={signInWithGithub}>
      Sign in with Github
    </button>
  );
}
