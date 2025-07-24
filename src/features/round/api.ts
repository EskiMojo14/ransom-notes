import { supabase } from "@/supabase";
import { api, supabaseQueryFn } from "@/supabase/api";
import type { Tables } from "@/supabase/types";
import type { Game } from "../game/api";

export interface Round
  extends Pick<Tables<"rounds">, "id" | "question" | "created_at"> {
  judge: Pick<Tables<"profiles">, "display_name"> | null;
}

export interface ActiveRound
  extends Pick<Tables<"rounds">, "id" | "question" | "created_at"> {
  judge: Pick<Tables<"profiles">, "display_name"> | null;
}

export const roundQueries = {
  getActiveRound: supabaseQueryFn(
    (gameId: Game["id"]) =>
      supabase
        .from("games")
        .select(
          `
          active_round:rounds(
            id, 
            question, 
            judge:profiles(display_name), 
            created_at
          )
         `,
        )
        .eq("id", gameId)
        .single(),
    ({ active_round }) => active_round,
  ),
  getGameRounds: supabaseQueryFn((gameId: Game["id"]) =>
    supabase
      .from("rounds")
      .select(
        `
        question, 
        created_at, 
        id, 
        judge:profiles(display_name)
      `,
      )
      .eq("game_id", gameId),
  ),
};

export const roundApi = api
  .enhanceEndpoints({ addTagTypes: ["Round", "Game"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getActiveRound: build.query({
        queryFn: roundQueries.getActiveRound,
        providesTags: (res, _err, gameId) => [
          { type: "Game", id: gameId },
          res ? { type: "Round" as const, id: res.id } : null,
        ],
      }),
      getGameRounds: build.query({
        queryFn: roundQueries.getGameRounds,
        providesTags: (res, _err, gameId) => [
          { type: "Game", id: gameId },
          ...(res ? res.map(({ id }) => ({ type: "Round" as const, id })) : []),
        ],
      }),
    }),
  });

export const { useGetActiveRoundQuery, useGetGameRoundsQuery } = roundApi;
