import { env } from "@/env";
import type { Database } from "./types";

export const tableUrl = (table: keyof Database["public"]["Tables"]) =>
  env.VITE_SUPABASE_URL + "/rest/v1/" + table;
