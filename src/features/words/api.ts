import { supabase } from "@/supabase";
import { api, supabaseQueryFn } from "@/supabase/api";
import type { Game } from "../game/api";

export const wordsApi = api
  .enhanceEndpoints({ addTagTypes: ["Word"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getWordPool: build.query<
        Array<string>,
        { gameId: Game["id"]; userId: string }
      >({
        queryFn: supabaseQueryFn(
          ({ gameId, userId }) =>
            supabase
              .from("word_pools")
              .select("words")
              .eq("game_id", gameId)
              .eq("user_id", userId)
              .single(),
          (wordPool) => wordPool.words,
        ),
        providesTags: (_res, _err, { gameId, userId }) => [
          { type: "Word", id: gameId },
          { type: "Word", id: userId },
        ],
      }),
    }),
  });

export const { useGetWordPoolQuery } = wordsApi;
