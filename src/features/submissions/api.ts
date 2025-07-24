import { createEntityAdapter } from "@reduxjs/toolkit";
import type { QueryData } from "@supabase/supabase-js";
import type { Round } from "@/features/round/api";
import { supabase } from "@/supabase";
import { api, cloneBuilder, supaEnhance } from "@/supabase/api";

const getSubmissions = supabase.from("submissions").select(`
  rows, 
  created_at, 
  user_id, 
  author:profiles(display_name)
`);

export type Submission = QueryData<typeof getSubmissions>[number];

const submissionAdapter = createEntityAdapter({
  selectId: (submission: Submission) => submission.user_id,
});

export const {
  selectAll: selectSubmissions,
  selectById: selectSubmissionById,
  selectIds: selectSubmissionIds,
  selectEntities: selectSubmissionEntities,
  selectTotal: selectTotalSubmissions,
} = submissionAdapter.getSelectors();

export const submissionApi = api
  .enhanceEndpoints({ addTagTypes: ["Round", "Submission"] })
  .injectEndpoints({
    endpoints: supaEnhance((build) => ({
      getSubmissions: build.query({
        query: (roundId: Round["id"]) =>
          cloneBuilder(getSubmissions).eq("round_id", roundId),
        transformResponse: (submissions) =>
          submissionAdapter.getInitialState(undefined, submissions),
        providesTags: (res, _err, roundId) => [
          { type: "Round", id: roundId },
          ...(res
            ? res.ids.map((id) => ({ type: "Submission" as const, id }))
            : []),
        ],
      }),
    })),
  });

export const { useGetSubmissionsQuery } = submissionApi;
