import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { hasLength } from "@/utils/types";
import type { Database, Tables } from "./types";
import { supabase } from ".";

type RealtimeHandlers<TableName extends keyof Database["public"]["Tables"]> = {
  [Event in RealtimePostgresChangesPayload<Tables<TableName>> as Lowercase<
    Event["eventType"]
  >]?: (payload: Event) => void;
};

export const listenTo = <TableName extends keyof Database["public"]["Tables"]>(
  table: TableName,
  handlers: RealtimeHandlers<TableName>,
  filter?: string,
) => {
  const events = Object.keys(handlers);
  return supabase.channel(`public:${table} changes`).on(
    "postgres_changes",
    {
      schema: "public",
      event: hasLength(events, 1) ? (events[0].toUpperCase() as "*") : "*",
      table,
      filter,
    },
    (payload) =>
      handlers[payload.eventType.toLowerCase() as keyof typeof handlers]?.(
        payload as never,
      ),
  );
};
