import { supabase } from "@/supabase";
import { api, supabaseQueryFn } from "@/supabase/api";

interface Participant {
  id: string;
  joined_at: string;
  user: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

const participantsApi = api
  .enhanceEndpoints({ addTagTypes: ["Participant"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getParticipants: build.query<Array<Participant>, number>({
        queryFn: supabaseQueryFn((gameId) =>
          supabase
            .from("participants")
            .select(
              `
              id:user_id,
              joined_at,
              user:profiles(
                display_name, 
                avatar_url
              )
              `,
            )
            .eq("game_id", gameId),
        ),
        providesTags: (res, _err, gameId) => [
          { type: "Participant", id: gameId },
          ...(res
            ? res.flatMap(({ id }) => [
                { type: "Participant" as const, id },
                { type: "User" as const, id },
              ])
            : []),
        ],
      }),
    }),
  });

export const { useGetParticipantsQuery } = participantsApi;
