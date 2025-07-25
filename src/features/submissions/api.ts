import type { EntityState } from "@reduxjs/toolkit";
import { createEntityAdapter } from "@reduxjs/toolkit";
import type { Round } from "@/features/round/api";
import { supabase } from "@/supabase";
import { api, supabaseQueryFn } from "@/supabase/api";
import type { Tables } from "@/supabase/types";

const submissionSelect = `
  rows, 
  created_at, 
  user_id, 
  author:profiles(display_name)
` as const;

export interface Submission
  extends Pick<Tables<"submissions">, "rows" | "created_at" | "user_id"> {
  author: Pick<Tables<"profiles">, "display_name">;
}

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
    endpoints: (build) => ({
      getSubmissions: build.query<
        EntityState<Submission, Submission["user_id"]>,
        Round["id"],
        Array<Submission>
      >({
        queryFn: supabaseQueryFn({
          query: (roundId) =>
            supabase
              .from("submissions")
              .select(submissionSelect)
              .eq("round_id", roundId),
          transformResponse: (submissions) =>
            submissionAdapter.getInitialState(undefined, submissions),
        }),
        providesTags: (res, _err, roundId) => [
          { type: "Round", id: roundId },
          ...(res
            ? res.ids.map((id) => ({ type: "Submission" as const, id }))
            : []),
        ],
      }),
    }),
  });

export const { useGetSubmissionsQuery } = submissionApi;
