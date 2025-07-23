import { Button } from "@/components/button";
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
  return <Button onPress={signInWithGithub}>Sign in with Github</Button>;
}
