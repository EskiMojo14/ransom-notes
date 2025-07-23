import { supabase } from "@/supabase";
import { api, supabaseQueryFn } from "@/supabase/api";
import type { Tables, TablesInsert } from "@/supabase/types";
import type { Compute, PickRequired } from "@/utils/types";
import type { GameConfig } from "./slice";

interface Game extends Tables<"games"> {
  creator_profile: Pick<Tables<"profiles">, "display_name" | "avatar_url">;
  participant_count: number;
}

export const gameApi = api
  .enhanceEndpoints({ addTagTypes: ["Game"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getGameByInviteCode: build.query<Game, Game["invite_code"]>({
        queryFn: supabaseQueryFn(
          (inviteCode) =>
            supabase
              .from("games")
              .select(
                `
                *,
                creator_profile:profiles(display_name, avatar_url),
                participants(count)
                `,
              )
              .eq("invite_code", inviteCode)
              .single(),
          ({ participants, ...game }) => ({
            ...game,
            participant_count: participants[0]?.count ?? 0,
          }),
        ),
        providesTags: (res, _err, inviteCode) => [
          { type: "Game", id: inviteCode },
          res ? { type: "Game" as const, id: res.id } : null,
        ],
      }),
      createGame: build.mutation<
        Pick<Game, "invite_code" | "id">,
        Compute<PickRequired<TablesInsert<"games">, "creator"> & GameConfig>
      >({
        queryFn: supabaseQueryFn(
          (game) =>
            supabase
              .from("games")
              .insert(game)
              .select("invite_code, id")
              .single(),
          (game) => game,
        ),
        invalidatesTags: (res) =>
          res
            ? [
                { type: "Game", id: res.id },
                { type: "Game", id: res.invite_code },
              ]
            : [],
      }),
    }),
  });

export const { useGetGameByInviteCodeQuery, useCreateGameMutation } = gameApi;
