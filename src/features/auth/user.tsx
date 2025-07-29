import { redirect } from "@tanstack/react-router";
import { supabase } from "@/supabase";

export const ensureAuthenticated = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (!data.session) {
    if (error) console.error(error);
    throw redirect({ to: "/login" });
  }
  return data.session;
};
