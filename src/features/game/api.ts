import { supabase } from "@/supabase";
import { api, supabaseQueryFn } from "@/supabase/api";
import type { Tables, TablesInsert } from "@/supabase/types";
import type { Compute, PickRequired } from "@/utils/types";
import type { GameConfig } from "./slice";

const profileSelect = `
  display_name, 
  avatar_url
` as const;
type Profile = Pick<Tables<"profiles">, "display_name" | "avatar_url">;

const gameSelect = `
  *,
  creator_profile:profiles!games_creator_fkey1(${profileSelect}),
  participants:profiles!participants(${profileSelect})
` as const;
interface RawGame extends Tables<"games"> {
  creator_profile: Profile;
  participants: Array<{ profiles: Profile }>;
}

const transformGame = ({
  creator_profile,
  participants,
  ...rawGame
}: RawGame) => ({
  ...rawGame,
  creator: creator_profile,
  participants: participants.map(({ profiles }) => profiles),
});
export type Game = ReturnType<typeof transformGame>;

export const gameApi = api
  .enhanceEndpoints({ addTagTypes: ["Game"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getGameByInviteCode: build.query<Game, Game["invite_code"], RawGame>({
        queryFn: supabaseQueryFn({
          query: (inviteCode) =>
            supabase
              .from("games")
              .select(gameSelect)
              .eq("invite_code", inviteCode)
              .single(),
          transformResponse: transformGame,
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

export const {
  useGetGameByInviteCodeQuery,
  useLazyGetGameByInviteCodeQuery,
  useCreateGameMutation,
} = gameApi;
