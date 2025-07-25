import type { Game } from "@/features/game/api";
import { supabase } from "@/supabase";
import { api, supabaseQueryFn } from "@/supabase/api";
import type { Tables } from "@/supabase/types";

const roundSelect = `
  question, 
  created_at, 
  id, 
  judge:profiles(display_name)
` as const;
export interface Round
  extends Pick<Tables<"rounds">, "question" | "created_at" | "id"> {
  judge: Pick<Tables<"profiles">, "display_name"> | null;
}

export const roundApi = api
  .enhanceEndpoints({ addTagTypes: ["Round", "Game", "Word"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getActiveRound: build.query<
        Round | null,
        Game["id"],
        { active_round: Round }
      >({
        queryFn: supabaseQueryFn({
          query: (gameId) =>
            supabase
              .from("games")
              .select(
                `
                  active_round:rounds(${roundSelect})
                `,
              )
              .eq("id", gameId)
              .single(),
          transformResponse: ({ active_round }) => active_round,
        }),
        providesTags: (res, _err, gameId) => [
          { type: "Game", id: gameId },
          res ? { type: "Round" as const, id: res.id } : null,
        ],
      }),

      getGameRounds: build.query<Array<Round>, Game["id"], Array<Round>>({
        queryFn: supabaseQueryFn((gameId) =>
          supabase.from("rounds").select(roundSelect).eq("game_id", gameId),
        ),
        providesTags: (res, _err, gameId) => [
          { type: "Game", id: gameId },
          ...(res ? res.map(({ id }) => ({ type: "Round" as const, id })) : []),
        ],
      }),

      getWordPool: build.query<
        Array<string>,
        { gameId: Game["id"]; roundId: Round["id"]; userId: string },
        { words: Array<string> }
      >({
        queryFn: supabaseQueryFn({
          query: ({ gameId, userId }) =>
            supabase
              .from("word_pools")
              .select("words")
              .eq("game_id", gameId)
              .eq("user_id", userId)
              .single(),
          transformResponse: (wordPool) => wordPool.words,
        }),
        providesTags: (_res, _err, { roundId, userId }) => [
          { type: "Word", id: roundId },
          { type: "Word", id: userId },
        ],
      }),
    }),
  });

export const {
  useGetActiveRoundQuery,
  useGetGameRoundsQuery,
  useGetWordPoolQuery,
} = roundApi;
