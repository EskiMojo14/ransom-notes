import {
  randEmail,
  randFullName,
  randRecentDate,
  randUserName,
} from "@ngneat/falso";
import type { Session } from "@supabase/supabase-js";
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

export const mockSession = (userValues: Partial<Session["user"]> = {}) =>
  ({
    access_token: "",
    refresh_token: "",
    expires_in: 0,
    token_type: "bearer",
    user: {
      id: "1",
      email: randEmail(),
      app_metadata: {},
      aud: "",
      created_at: randRecentDate().toISOString(),
      updated_at: randRecentDate().toISOString(),
      ...userValues,
      user_metadata: {
        ...userValues.user_metadata,
        full_name: randFullName(),
        user_name: randUserName(),
      },
    },
  }) satisfies Session;
