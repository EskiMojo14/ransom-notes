import type { EntityState } from "@reduxjs/toolkit";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { randomInt } from "es-toolkit";
import type { Game } from "@/features/game/api";
import { profileApi } from "@/features/profile/api";
import { supabase } from "@/supabase";
import { api, supabaseQueryFn } from "@/supabase/api";
import { listenTo } from "@/supabase/realtime";
import type { Tables } from "@/supabase/types";

const messageSelect = `
  id,
  created_at,
  message,
  user_id,
  author:profiles(display_name)
` as const;
export interface Message
  extends Pick<
    Tables<"messages">,
    "id" | "created_at" | "message" | "user_id"
  > {
  author: Pick<Tables<"profiles">, "display_name">;
}

const messageAdapter = createEntityAdapter<Message>({
  sortComparer: (a, b) => a.created_at.localeCompare(b.created_at),
});

export const chatApi = api
  .enhanceEndpoints({ addTagTypes: ["Chat"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getChatMessages: build.query<
        EntityState<Message, Message["id"]>,
        Game["id"],
        Array<Message>
      >({
        queryFn: supabaseQueryFn({
          query: (gameId) =>
            supabase
              .from("messages")
              .select(messageSelect)
              .eq("game_id", gameId),
          transformResponse: (messages) =>
            messageAdapter.getInitialState(undefined, messages),
        }),
        providesTags: (_res, _err, gameId) => [{ type: "Chat", id: gameId }],
        async onCacheEntryAdded(
          gameId,
          // eslint-disable-next-line @typescript-eslint/unbound-method
          { dispatch, updateCachedData, cacheDataLoaded, cacheEntryRemoved },
        ) {
          try {
            await cacheDataLoaded;
            const subscriptions: Array<{ unsubscribe: () => void }> = [];
            const channel = await listenTo(
              "messages",
              {
                async insert({ new: { user_id, id, created_at, message } }) {
                  const sub = dispatch(
                    profileApi.endpoints.getProfile.initiate(user_id),
                  );
                  subscriptions.push(sub);
                  const author = await sub.unwrap();
                  updateCachedData((draft) =>
                    messageAdapter.addOne(draft, {
                      id,
                      created_at,
                      message,
                      user_id,
                      author,
                    }),
                  );
                },
                update({ new: { id, message } }) {
                  updateCachedData((draft) =>
                    messageAdapter.updateOne(draft, {
                      id,
                      changes: { message },
                    }),
                  );
                },
                delete({ old: { id } }) {
                  if (id) {
                    updateCachedData((draft) =>
                      messageAdapter.removeOne(draft, id),
                    );
                  }
                },
              },
              `game_id=eq.${gameId}`,
            );
            await cacheEntryRemoved;
            await channel.unsubscribe();
            for (const sub of subscriptions) sub.unsubscribe();
          } catch {
            // cacheDataLoaded throws if the cache entry is removed before the promise resolves
          }
        },
      }),
      sendChatMessage: build.mutation<
        Message,
        { gameId: Game["id"]; userId: string; message: string },
        Message
      >({
        queryFn: supabaseQueryFn(({ gameId, userId, message }) =>
          supabase
            .from("messages")
            .insert({ game_id: gameId, user_id: userId, message })
            .select(messageSelect)
            .single(),
        ),
        async onQueryStarted(
          { gameId, userId, message },
          { dispatch, queryFulfilled },
        ) {
          const tempId = -randomInt(20);
          const profile = await dispatch(
            profileApi.endpoints.getProfile.initiate(userId),
          ).unwrap();
          const { undo } = dispatch(
            chatApi.util.updateQueryData("getChatMessages", gameId, (draft) =>
              messageAdapter.addOne(draft, {
                id: tempId,
                created_at: new Date().toISOString(),
                message,
                user_id: userId,
                author: profile,
              }),
            ),
          );
          try {
            const { data } = await queryFulfilled;
            dispatch(
              chatApi.util.updateQueryData("getChatMessages", gameId, (draft) =>
                messageAdapter.updateOne(draft, {
                  id: tempId,
                  changes: data,
                }),
              ),
            );
          } catch {
            undo();
          }
        },
        extraOptions: { minimumPendingTime: false },
      }),
    }),
  });

export const { useGetChatMessagesQuery, useSendChatMessageMutation } = chatApi;

export const {
  selectAll: selectMessages,
  selectById: selectMessageById,
  selectIds: selectMessageIds,
  selectEntities: selectMessageEntities,
  selectTotal: selectTotalMessages,
} = messageAdapter.getSelectors();

export const selectGroupedMessages = createSelector(
  selectMessages,
  (messages) => {
    // group messages by author if they're within 30 seconds of each other
    const result: Array<Array<Message>> = [];
    let currentGroup: Array<Message> = [];
    let lastMessage: Message | undefined;
    for (const message of messages) {
      if (
        lastMessage &&
        (lastMessage.user_id !== message.user_id ||
          new Date(message.created_at).getTime() -
            new Date(lastMessage.created_at).getTime() >
            30_000)
      ) {
        result.push(currentGroup);
        currentGroup = [];
      }
      currentGroup.push(message);
      lastMessage = message;
    }
    if (currentGroup.length) {
      result.push(currentGroup);
    }
    return result;
  },
);
