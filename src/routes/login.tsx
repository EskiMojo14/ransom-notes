import { createFileRoute, redirect } from "@tanstack/react-router";
import { GithubSignin } from "@/features/auth/GithubSignin";
import { supabase } from "@/supabase";

export const Route = createFileRoute("/login")({
  async beforeLoad() {
    const { data, error } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/" });
    if (error) throw error;
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <GithubSignin />
    </div>
  );
}
