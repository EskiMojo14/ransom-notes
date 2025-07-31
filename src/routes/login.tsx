import { createFileRoute, redirect } from "@tanstack/react-router";
import { GithubSignin } from "@/features/auth/GithubSignin";
import { supabase } from "@/supabase";
import styles from "./login.css?url";

export const Route = createFileRoute("/login")({
  head: () => ({
    links: [
      {
        rel: "stylesheet",
        href: styles,
      },
    ],
  }),
  async beforeLoad() {
    const { data, error } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/" });
    if (error) throw error;
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main>
      <GithubSignin />
    </main>
  );
}
