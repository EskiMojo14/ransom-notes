import type { QueryData } from "@supabase/supabase-js";
import { supabase } from "@/supabase";
import { api, cloneBuilder, supaEnhance } from "@/supabase/api";
import type { Game } from "../game/api";

const getRounds = supabase.from("rounds").select(`
  question, 
  created_at, 
  id, 
  judge:profiles(display_name)
`);
export type Round = QueryData<typeof getRounds>[number];

const getActiveRounds = supabase.from("games").select(`
  active_round:rounds(
    id, 
    question, 
    judge:profiles(display_name), 
    created_at
  )
`);
export type ActiveRound = QueryData<
  typeof getActiveRounds
>[number]["active_round"];

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
