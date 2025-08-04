import { skipToken } from "@reduxjs/toolkit/query";
import { assert } from "es-toolkit";
import { ToggleButtonGroup } from "react-aria-components";
import { useSession } from "@/features/auth/session";
import type { Game } from "@/features/game/api";
import { useGetGameByInviteCodeQuery } from "@/features/game/api";
import type { Round } from "@/features/round/api";
import { useGetActiveRoundQuery } from "@/features/round/api";
import {
  selectSubmissionIds,
  useGetSubmissionsQuery,
} from "@/features/submissions/api";
import { Route } from "@/routes/game/$inviteCode";
import { assertNever } from "@/utils";
import { selectVoteById, useGetVotesQuery, useUpsertVoteMutation } from "./api";
import { Submission } from "./Submission";
import styles from "./Submissions.module.css";

function allowVoting(game: Game, round: Round, userId: string): boolean {
  if (round.phase !== "voting") return false;
  switch (game.voting_mode) {
    case "jury":
      return true;
    case "judge":
    case "executioner":
      return round.judge_id === userId;
    default:
      assertNever(game.voting_mode);
  }
}

export function Submissions() {
  const { user } = useSession();
  const inviteCode = Route.useParams({
    select: ({ inviteCode }) => inviteCode,
  });
  const { game } = useGetGameByInviteCodeQuery(inviteCode, {
    selectFromResult: ({ data }) => ({ game: data }),
  });
  const { round } = useGetActiveRoundQuery(game?.id ?? skipToken, {
    selectFromResult: ({ data }) => ({ round: data }),
  });
  const { authors = [] } = useGetSubmissionsQuery(round?.id ?? skipToken, {
    selectFromResult: ({ data }) => ({
      authors: data && selectSubmissionIds(data),
    }),
  });
  const { currentVote } = useGetVotesQuery(round?.id ?? skipToken, {
    selectFromResult: ({ data }) => ({
      currentVote: data && selectVoteById(data, user.id),
    }),
  });
  const [upsertVote] = useUpsertVoteMutation({
    selectFromResult: () => ({}),
  });
  if (!game || !round) return null;
  return (
    <ToggleButtonGroup
      className={styles.submissions}
      selectionMode="single"
      isDisabled={!allowVoting(game, round, user.id)}
      selectedKeys={currentVote ? [currentVote.author_id] : []}
      onSelectionChange={([key]) => {
        assert(typeof key === "string", "Key should be defined");
        void upsertVote({
          author_id: key,
          round_id: round.id,
          user_id: user.id,
        }).unwrap();
      }}
    >
      {authors.map((authorId) => (
        <Submission key={authorId} roundId={round.id} authorId={authorId} />
      ))}
    </ToggleButtonGroup>
  );
}
