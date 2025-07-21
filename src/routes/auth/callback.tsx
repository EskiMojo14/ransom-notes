import { createFileRoute, redirect } from "@tanstack/react-router";
import * as v from "valibot";
import { client } from "@/supabase";

export const Route = createFileRoute("/auth/callback")({
  validateSearch: v.object({
    code: v.string(),
    next: v.optional(v.string()),
  }),
  async beforeLoad({ search: { code, next = "/" } }) {
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (!error) throw redirect({ to: next });
    throw error;
  },
});
