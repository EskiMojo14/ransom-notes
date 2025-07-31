import type {
  RealtimeChannel,
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";
import { REALTIME_SUBSCRIBE_STATES } from "@supabase/supabase-js";
import { getOrInsertComputed, string } from "@/utils";
import { hasLength, type PickFromUnion } from "@/utils/types";
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
      [Event in RealtimePostgresChangesPayload<Tables<TTableName>> as Lowercase<
        Event["eventType"]
      >]-?: (payload: Pick<Event, "old" | "new">) => void;
    },
    {
      get(_, prop) {
        return (
          partialEvent: PickFromUnion<
            RealtimePostgresChangesPayload<Tables<TTableName>>,
            "old" | "new"
          >,
        ) => {
          const event = {
            schema: "public",
            table,
            commit_timestamp: new Date().toISOString(),
            errors: [],
            ...partialEvent,
            eventType: prop.toString().toUpperCase() as Exclude<
              `${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT}`,
              "*"
            >,
          };
          for (const handlers of handlerMap.get(table) ?? []) {
            void handlers[prop as keyof RealtimeHandlers<TTableName>]?.(
              event as never,
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
  const channel = supabase.channel(`public:${table} changes`).on(
    "postgres_changes",
    {
      schema: "public",
      event: hasLength(events, 1) ? (events[0].toUpperCase() as "*") : "*",
      table,
      filter,
    },
    (payload) => {
      void handlers[string.toLowerCase(payload.eventType)]?.(payload as never);
    },
  );
  const { promise, resolve, reject } = Promise.withResolvers<RealtimeChannel>();
  channel.subscribe((state, err) => {
    if (state === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) resolve(channel);
    else if (err) reject(err);
  });
  return promise;
};
