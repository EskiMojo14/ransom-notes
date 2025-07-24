import { supabase } from "@/supabase";
import { api, supaEnhance } from "@/supabase/api";
import type { Game } from "../game/api";

export const wordsApi = api
  .enhanceEndpoints({ addTagTypes: ["Word"] })
  .injectEndpoints({
    endpoints: supaEnhance((build) => ({
      getWordPool: build.query({
        query: ({ gameId, userId }: { gameId: Game["id"]; userId: string }) =>
          supabase
            .from("word_pools")
            .select("words")
            .eq("game_id", gameId)
            .eq("user_id", userId)
            .single(),
        transformResponse: (wordPool) => wordPool.words,
        providesTags: (_res, _err, { gameId, userId }) => [
          { type: "Word", id: gameId },
          { type: "Word", id: userId },
        ],
      }),
    })),
  });

export const { useGetWordPoolQuery } = wordsApi;
