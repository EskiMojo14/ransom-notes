import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/supabase";

export const Route = createFileRoute("/logout")({
  async beforeLoad() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    throw redirect({ to: "/login" });
  },
});
