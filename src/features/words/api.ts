import type { Game } from "@/features/game/api";
import { supabase } from "@/supabase";
import { api, supabaseQueryFn } from "@/supabase/api";

export const wordsApi = api
  .enhanceEndpoints({ addTagTypes: ["Word"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getWordPool: build.query<
        Array<string>,
        { gameId: Game["id"]; userId: string },
        { words: Array<string> }
      >({
        queryFn: supabaseQueryFn({
          query: ({ gameId, userId }: { gameId: Game["id"]; userId: string }) =>
            supabase
              .from("word_pools")
              .select("words")
              .eq("game_id", gameId)
              .eq("user_id", userId)
              .single(),
          transformResponse: (wordPool) => wordPool.words,
        }),
        providesTags: (_res, _err, { gameId, userId }) => [
          { type: "Word", id: gameId },
          { type: "Word", id: userId },
        ],
      }),
    }),
  });

export const { useGetWordPoolQuery } = wordsApi;
