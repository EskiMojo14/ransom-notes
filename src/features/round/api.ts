import type { QueryData } from "@supabase/supabase-js";
import type { Game } from "@/features/game/api";
import { supabase } from "@/supabase";
import { api, cloneBuilder, supaEnhance } from "@/supabase/api";

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
  .enhanceEndpoints({ addTagTypes: ["Round", "Game"] })
  .injectEndpoints({
    endpoints: supaEnhance((build) => ({
      getActiveRound: build.query({
        query: (gameId: Game["id"]) =>
          cloneBuilder(getActiveRounds).eq("id", gameId).single(),
        transformResponse: ({ active_round }) => active_round,
        providesTags: (res, _err, gameId) => [
          { type: "Game", id: gameId },
          res ? { type: "Round" as const, id: res.id } : null,
        ],
      }),
      getGameRounds: build.query({
        query: (gameId: Game["id"]) =>
          cloneBuilder(getRounds).eq("game_id", gameId),
        providesTags: (res, _err, gameId) => [
          { type: "Game", id: gameId },
          ...(res ? res.map(({ id }) => ({ type: "Round" as const, id })) : []),
        ],
      }),
    })),
  });

export const { useGetActiveRoundQuery, useGetGameRoundsQuery } = roundApi;
