import { createClient } from "@supabase/supabase-js";
import { env } from "@/env";
import type { Database } from "@/supabase/types";

export const client = createClient<Database>(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_ANON_KEY,
);
