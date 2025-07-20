import { createClient } from "@supabase/supabase-js";
import { env } from "@/env";
import type { Database } from "@/supabase/types";

export const client = createClient<Database>(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
