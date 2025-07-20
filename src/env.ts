import * as v from "valibot";

const envSchema = v.object({
  NEXT_PUBLIC_SUPABASE_URL: v.string(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: v.string(),
});

export const env = v.parse(envSchema, import.meta.env);
