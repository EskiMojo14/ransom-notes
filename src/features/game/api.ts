import type { QueryData } from "@supabase/supabase-js";
import { supabase } from "@/supabase";
import { api, cloneBuilder, supabaseQueryFn } from "@/supabase/api";
import type { TablesInsert } from "@/supabase/types";
import type { Compute, Override, PickRequired } from "@/utils/types";
import type { GameConfig } from "./slice";

const getGames = supabase.from("games").select(`
  *,
  creator_profile:profiles(display_name, avatar_url),
  participants(profiles(display_name, avatar_url))
`);
type RawGame = QueryData<typeof getGames>[number];
export type Game = Override<
  Omit<RawGame, "creator_profile">,
  {
    creator: RawGame["creator_profile"];
    participants: Array<RawGame["participants"][number]["profiles"]>;
  }
>;

export const gameApi = api
  .enhanceEndpoints({ addTagTypes: ["Game"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getGameByInviteCode: build.query<Game, Game["invite_code"], RawGame>({
        queryFn: supabaseQueryFn({
          query: (inviteCode) =>
            cloneBuilder(getGames).eq("invite_code", inviteCode).single(),
          transformResponse: ({ participants, creator_profile, ...game }) => ({
            ...game,
            creator: creator_profile,
            participants: participants.map(({ profiles }) => profiles),
          }),
        }),
        providesTags: (res, _err, inviteCode) => [
          { type: "Game", id: inviteCode },
          res ? { type: "Game" as const, id: res.id } : null,
        ],
      }),
      createGame: build.mutation<
        Pick<Game, "invite_code" | "id">,
        Compute<PickRequired<TablesInsert<"games">, "creator"> & GameConfig>,
        Pick<Game, "invite_code" | "id">
      >({
        queryFn: supabaseQueryFn((game) =>
          supabase
            .from("games")
            .insert(game)
            .select("invite_code, id")
            .single(),
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
