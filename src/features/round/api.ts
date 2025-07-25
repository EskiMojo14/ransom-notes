import type { QueryData } from "@supabase/supabase-js";
import type { Game } from "@/features/game/api";
import { supabase } from "@/supabase";
import { api, cloneBuilder, supabaseQueryFn } from "@/supabase/api";

const roundSelect = `
  question, 
  created_at, 
  id, 
  judge:profiles(display_name)
` as const;

const getRounds = supabase.from("rounds").select(roundSelect);
export type Round = QueryData<typeof getRounds>[number];

const getActiveRounds = supabase.from("games").select(`
  active_round:rounds(${roundSelect})
`);

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
            cloneBuilder(getActiveRounds).eq("id", gameId).single(),
          transformResponse: ({ active_round }) => active_round,
        }),
        providesTags: (res, _err, gameId) => [
          { type: "Game", id: gameId },
          res ? { type: "Round" as const, id: res.id } : null,
        ],
      }),

      getGameRounds: build.query<Array<Round>, Game["id"], Array<Round>>({
        queryFn: supabaseQueryFn((gameId) =>
          cloneBuilder(getRounds).eq("game_id", gameId),
        ),
        providesTags: (res, _err, gameId) => [
          { type: "Game", id: gameId },
          ...(res ? res.map(({ id }) => ({ type: "Round" as const, id })) : []),
        ],
      }),

      getWordPool: build.query<
        Array<string>,
        { gameId: Game["id"]; roundId: Round["id"]; userId: string },
        Array<string>
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
