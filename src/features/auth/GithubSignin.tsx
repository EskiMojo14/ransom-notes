import { Button } from "@/components/button";
import { supabase } from "@/supabase";

export function GithubSignin() {
  function signInWithGithub() {
    void supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: new URL("/auth/callback", window.location.href).href,
      },
    });
  }
  return <Button onPress={signInWithGithub}>Sign in with Github</Button>;
}
