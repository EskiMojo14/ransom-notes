import { supabase } from "@/supabase";
import { api, supabaseQueryFn } from "@/supabase/api";
import type { Tables } from "@/supabase/types";

export const profileSelect = `
  display_name, 
  avatar_url
` as const;
export interface Profile
  extends Pick<Tables<"profiles">, "display_name" | "avatar_url"> {}

export const userApi = api
  .enhanceEndpoints({ addTagTypes: ["Profile"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getProfile: build.query<Profile, string, Profile>({
        queryFn: supabaseQueryFn((userId) =>
          supabase
            .from("profiles")
            .select(profileSelect)
            .eq("id", userId)
            .single(),
        ),
        providesTags: (_res, _err, userId) => [{ type: "Profile", id: userId }],
      }),
    }),
  });

export const { useGetProfileQuery } = userApi;
