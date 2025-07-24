import { createEntityAdapter } from "@reduxjs/toolkit";
import { supabase } from "@/supabase";
import { api, supaEnhance } from "@/supabase/api";
import type { Tables } from "@/supabase/types";
import type { Round } from "../round/api";

export interface Submission
  extends Pick<Tables<"submissions">, "created_at" | "rows" | "user_id"> {
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
    endpoints: supaEnhance((build) => ({
      getSubmissions: build.query({
        query: (roundId: Round["id"]) =>
          supabase
            .from("submissions")
            .select("rows, created_at, user_id, author:profiles(display_name)")
            .eq("round_id", roundId),
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
