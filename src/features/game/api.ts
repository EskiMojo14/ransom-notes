import { supabase } from "@/supabase";
import { api, supabaseQueryFn } from "@/supabase/api";
import type { Tables, TablesInsert } from "@/supabase/types";
import type {
  Compute,
  PickRequired,
  QueryBuilders,
  EndpointsForQueries,
} from "@/utils/types";
import type { GameConfig } from "./slice";

export interface Game extends Tables<"games"> {
  creator_profile: Pick<Tables<"profiles">, "display_name" | "avatar_url">;
  participants: Array<Pick<Tables<"profiles">, "display_name" | "avatar_url">>;
}

export const gameQueries = {
  getGameByInviteCode: (inviteCode: Game["invite_code"]) =>
    supabase
      .from("games")
      .select(
        `
        *,
        creator_profile:profiles(display_name, avatar_url),
        participants(profiles(display_name, avatar_url))
        `,
      )
      .eq("invite_code", inviteCode)
      .single(),
  createGame: (
    game: Compute<PickRequired<TablesInsert<"games">, "creator"> & GameConfig>,
  ) => supabase.from("games").insert(game).select("invite_code, id").single(),
} satisfies QueryBuilders;

export const gameApi = api
  .enhanceEndpoints({ addTagTypes: ["Game"] })
  .injectEndpoints({
    endpoints: (build) =>
      ({
        getGameByInviteCode: build.query<Game, Game["invite_code"]>({
          queryFn: supabaseQueryFn(
            gameQueries.getGameByInviteCode,
            ({ participants, ...game }) => ({
              ...game,
              participants: participants.map(({ profiles }) => profiles),
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
          queryFn: supabaseQueryFn(gameQueries.createGame, (game) => game),
          invalidatesTags: (res) =>
            res
              ? [
                  { type: "Game", id: res.id },
                  { type: "Game", id: res.invite_code },
                ]
              : [],
        }),
      }) satisfies EndpointsForQueries<typeof gameQueries>,
  });

export const { useGetGameByInviteCodeQuery, useCreateGameMutation } = gameApi;
