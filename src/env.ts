import * as v from "valibot";

const envSchema = v.object({
  VITE_SUPABASE_URL: v.string(),
  VITE_SUPABASE_ANON_KEY: v.string(),
});

export const env = v.parse(envSchema, import.meta.env);
