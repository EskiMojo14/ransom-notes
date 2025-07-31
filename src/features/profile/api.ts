import { supabase } from "@/supabase";
import { api, supabaseQueryFn } from "@/supabase/api";
import type { Tables, TablesUpdate } from "@/supabase/types";

export const profileSelect = `
  display_name, 
  avatar_url
` as const;
export interface Profile
  extends Pick<Tables<"profiles">, "display_name" | "avatar_url"> {}

export const profileApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query<Profile, string, Profile>({
      queryFn: supabaseQueryFn((userId) =>
        supabase
          .from("profiles")
          .select(profileSelect)
          .eq("id", userId)
          .single(),
      ),
    }),
    updateProfile: build.mutation<
      Profile,
      { userId: string; updates: TablesUpdate<"profiles"> },
      Profile
    >({
      queryFn: supabaseQueryFn(({ userId, updates }) =>
        supabase
          .from("profiles")
          .update(updates)
          .eq("id", userId)
          .select(profileSelect)
          .single(),
      ),
      onQueryStarted({ userId, updates }, { dispatch, queryFulfilled }) {
        const { undo } = dispatch(
          profileApi.util.updateQueryData("getProfile", userId, (draft) => {
            Object.assign(draft, updates);
          }),
        );
        queryFulfilled.catch(undo);
      },
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;
