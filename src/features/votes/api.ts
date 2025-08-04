import {
  createEntityAdapter,
  createSelector,
  type EntityState,
} from "@reduxjs/toolkit";
import { profileApi } from "@/features/profile/api";
import type { Round } from "@/features/round/api";
import { supabase } from "@/supabase";
import { api, supabaseQueryFn } from "@/supabase/api";
import type { Tables, TablesInsert } from "@/supabase/types";

export const voteSelect = `
  *,
  user:profiles!votes_user_id_fkey1(display_name)
` as const;
export interface Vote extends Tables<"votes"> {
  user: Pick<Tables<"profiles">, "display_name">;
}

export const voteAdapter = createEntityAdapter({
  selectId: (vote: Vote) => vote.user_id,
});

export const voteApi = api.injectEndpoints({
  endpoints: (build) => ({
    getVotes: build.query<
      EntityState<Vote, Vote["user_id"]>,
      Round["id"],
      Array<Vote>
    >({
      queryFn: supabaseQueryFn({
        query: (roundId) =>
          supabase.from("votes").select(voteSelect).eq("round_id", roundId),
        transformResponse: (votes) =>
          voteAdapter.getInitialState(undefined, votes),
      }),
    }),
    upsertVote: build.mutation<Vote, TablesInsert<"votes">, Vote>({
      queryFn: supabaseQueryFn((vote) =>
        supabase.from("votes").upsert(vote).select(voteSelect).single(),
      ),
      async onQueryStarted(
        { author_id, round_id, user_id },
        { dispatch, queryFulfilled },
      ) {
        const profile = await dispatch(
          profileApi.endpoints.getProfile.initiate(user_id),
        ).unwrap();
        const { undo } = dispatch(
          voteApi.util.updateQueryData("getVotes", round_id, (draft) =>
            voteAdapter.upsertOne(draft, {
              author_id,
              round_id,
              user_id,
              user: profile,
            }),
          ),
        );
        queryFulfilled.catch(undo);
      },
    }),
  }),
});

export const { useGetVotesQuery, useUpsertVoteMutation } = voteApi;

export const {
  selectAll: selectVotes,
  selectById: selectVoteById,
  selectIds: selectVoteIds,
  selectEntities: selectVoteEntities,
  selectTotal: selectTotalVotes,
} = voteAdapter.getSelectors();

export const selectVotesByAuthor = createSelector(selectVotes, (votes) =>
  Object.groupBy(votes, (vote) => vote.author_id),
);
