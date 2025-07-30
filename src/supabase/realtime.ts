import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { getOrInsertComputed, string } from "@/utils";
import { hasLength } from "@/utils/types";
import type { Database, Tables } from "./types";
import { supabase } from ".";

type TableName = keyof Database["public"]["Tables"];

type RealtimeHandlers<TTableName extends TableName> = {
  [Event in RealtimePostgresChangesPayload<Tables<TTableName>> as Lowercase<
    Event["eventType"]
  >]?: (payload: Event) => void | Promise<void>;
};

const handlerMap = new Map<TableName, Set<RealtimeHandlers<TableName>>>();

export const getHandlers = <TTableName extends TableName>(table: TTableName) =>
  new Proxy(
    {} as {
      [EventType in keyof RealtimeHandlers<TTableName>]-?: (
        ...args: Parameters<
          NonNullable<RealtimeHandlers<TTableName>[EventType]>
        >
      ) => void;
    },
    {
      get(_, prop) {
        return (...args: [never]) => {
          for (const handlers of handlerMap.get(table) ?? []) {
            void handlers[prop as keyof RealtimeHandlers<TTableName>]?.(
              ...args,
            );
          }
        };
      },
    },
  );

export const listenTo = <TTableName extends TableName>(
  table: TTableName,
  handlers: RealtimeHandlers<TTableName>,
  filter?: string,
) => {
  getOrInsertComputed(handlerMap, table, () => new Set()).add(handlers);
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
      void handlers[string.toLowerCase(payload.eventType)]?.(payload as never),
  );
};
