import * as v from "valibot";

const envSchema = v.object({
  VITE_SUPABASE_URL: v.string(),
  VITE_SUPABASE_ANON_KEY: v.string(),
  VITE_USE_MOCKS: v.optional(
    v.pipe(
      v.string(),
      v.transform((value) => value === "1" || value.toLowerCase() === "true"),
    ),
  ),
});

export const env = v.parse(envSchema, import.meta.env);
