import { supabase } from "@/supabase";
import { api, supabaseQueryFn } from "@/supabase/api";
import type { Game } from "../game/api";

export const wordsQueries = {
  getWordPool: supabaseQueryFn(
    ({ gameId, userId }: { gameId: Game["id"]; userId: string }) =>
      supabase
        .from("word_pools")
        .select("words")
        .eq("game_id", gameId)
        .eq("user_id", userId)
        .single(),
    (wordPool) => wordPool.words,
  ),
};

export const wordsApi = api
  .enhanceEndpoints({ addTagTypes: ["Word"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getWordPool: build.query({
        queryFn: wordsQueries.getWordPool,
        providesTags: (_res, _err, { gameId, userId }) => [
          { type: "Word", id: gameId },
          { type: "Word", id: userId },
        ],
      }),
    }),
  });

export const { useGetWordPoolQuery } = wordsApi;
