import { env } from "@/env";
import type { Database } from "./types";

export const tableUrl = (table: keyof Database["public"]["Tables"]) =>
  env.VITE_SUPABASE_URL + "/rest/v1/" + table;

export const NotFoundError = {
  code: "PGRST116",
  details: "The result contains 0 rows",
  hint: null,
  message: "JSON object requested, multiple (or no) rows returned",
};
