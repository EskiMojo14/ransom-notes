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

export const roundApi = api
  .enhanceEndpoints({ addTagTypes: ["Round", "Game"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getActiveRound: build.query<ActiveRound | null, Game["id"]>({
        queryFn: supabaseQueryFn(
          (gameId) =>
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
        providesTags: (res, _err, gameId) => [
          { type: "Game", id: gameId },
          res ? { type: "Round" as const, id: res.id } : null,
        ],
      }),
      getGameRounds: build.query<Array<Round>, Game["id"]>({
        queryFn: supabaseQueryFn((gameId) =>
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
        providesTags: (res, _err, gameId) => [
          { type: "Game", id: gameId },
          ...(res ? res.map(({ id }) => ({ type: "Round" as const, id })) : []),
        ],
      }),
    }),
  });
