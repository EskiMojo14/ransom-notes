import { customAlphabet } from "nanoid";
import type { Profile } from "@/features/auth/api";
import { profileSelect } from "@/features/auth/api";
import { supabase } from "@/supabase";
import { api, supabaseQueryFn } from "@/supabase/api";
import type { Tables, TablesInsert } from "@/supabase/types";
import type { Compute, PickRequired } from "@/utils/types";

export const makeInviteCode = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 5);

const gameSelect = `
  *,
  creator:profiles!games_creator_fkey1(${profileSelect}),
  participants:profiles!participants(${profileSelect})
` as const;
interface RawGame extends Tables<"games"> {
  creator: Profile;
  participants: Array<{ profiles: Profile }>;
}

export const transformGame = ({ participants, ...rawGame }: RawGame) => ({
  ...rawGame,
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
        Compute<PickRequired<TablesInsert<"games">, "creator_id">>,
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
