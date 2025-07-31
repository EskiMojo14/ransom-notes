import type { Game } from "@/features/game/api";
import { supabase } from "@/supabase";
import { api, supabaseQueryFn } from "@/supabase/api";
import { listenTo } from "@/supabase/realtime";
import type { Tables } from "@/supabase/types";

const roundSelect = `
  prompt:prompts(prompt), 
  created_at, 
  id, 
  phase,
  judge:profiles!rounds_judge_id_fkey1(display_name)
` as const;
interface RawRound
  extends Pick<Tables<"rounds">, "created_at" | "id" | "phase"> {
  judge: Pick<Tables<"profiles">, "display_name"> | null;
  prompt: { prompt: string };
}
const transformRound = ({ prompt: { prompt }, ...round }: RawRound) => ({
  ...round,
  prompt,
});
export type Round = ReturnType<typeof transformRound>;

export const roundApi = api
  .enhanceEndpoints({ addTagTypes: ["Round", "Game"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getActiveRound: build.query<
        Round | null,
        Game["id"],
        { active_round: RawRound }
      >({
        queryFn: supabaseQueryFn({
          query: (gameId) =>
            supabase
              .from("games")
              .select(
                `
                  active_round:rounds!games_active_round_fkey(${roundSelect})
                `,
              )
              .eq("id", gameId)
              .single(),
          transformResponse: ({ active_round }) =>
            active_round && transformRound(active_round),
        }),
        providesTags: (res, _err, gameId) => [
          { type: "Game", id: gameId },
          res ? { type: "Round" as const, id: res.id } : null,
        ],
      }),

      getGameRounds: build.query<Array<Round>, Game["id"], Array<RawRound>>({
        queryFn: supabaseQueryFn({
          query: (gameId) =>
            supabase.from("rounds").select(roundSelect).eq("game_id", gameId),
          transformResponse: (rounds) => rounds.map(transformRound),
        }),
        providesTags: (res, _err, gameId) => [
          { type: "Game", id: gameId },
          ...(res ? res.map(({ id }) => ({ type: "Round" as const, id })) : []),
        ],
      }),

      getWordPool: build.query<
        Array<string>,
        { gameId: Game["id"]; userId: string },
        { words: Array<string> }
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
        async onCacheEntryAdded(
          { gameId, userId },
          // eslint-disable-next-line @typescript-eslint/unbound-method
          { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
        ) {
          try {
            await cacheDataLoaded;
            const channel = await listenTo(
              "word_pools",
              {
                update({ new: { game_id, words } }) {
                  if (game_id !== gameId) return;
                  updateCachedData(() => words);
                },
              },
              `user_id=eq.${userId}`,
            );
            await cacheEntryRemoved;
            await channel.unsubscribe();
          } catch {
            // cacheDataLoaded throws if the cache entry is removed before the promise resolves
          }
        },
      }),
    }),
  });

export const {
  useGetActiveRoundQuery,
  useGetGameRoundsQuery,
  useGetWordPoolQuery,
} = roundApi;
