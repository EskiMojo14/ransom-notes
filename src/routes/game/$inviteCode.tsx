import { randRecentDate, randUserName } from "@ngneat/falso";
import { createFileRoute } from "@tanstack/react-router";
import { http, HttpResponse } from "msw";
import { gameApi, useGetGameByInviteCodeQuery } from "@/features/game/api";
import type { roundApi } from "@/features/round/api";
import { CurrentSubmission } from "@/features/submissions/CurrentSubmission";
import { WordPool } from "@/features/submissions/WordPool";
import { worker } from "@/mocks/browser";
import { randQuestion, randWordPool } from "@/storybook/mocks";
import { tableUrl } from "@/supabase/mocks";

worker.use(
  http.get<
    {},
    undefined,
    | typeof gameApi.endpoints.getGameByInviteCode.Types.RawResultType
    | typeof roundApi.endpoints.getActiveRound.Types.RawResultType
  >(tableUrl("games"), ({ request }) => {
    const select = new URL(request.url).searchParams.get("select");
    if (select?.startsWith("active_round")) {
      return HttpResponse.json<
        typeof roundApi.endpoints.getActiveRound.Types.RawResultType
      >({
        active_round: {
          id: 1,
          question: randQuestion(),
          judge: null,
          created_at: randRecentDate().toISOString(),
          phase: "submission",
        },
      });
    }
    return HttpResponse.json<
      typeof gameApi.endpoints.getGameByInviteCode.Types.RawResultType
    >({
      id: 1,
      invite_code: "1234",
      creator: "1",
      first_to: 10,
      max_submission_length: 100,
      pool_size: 7,
      state: "running",
      voting_mode: "judge",
      created_at: randRecentDate().toISOString(),
      active_round: 1,
      creator_profile: {
        display_name: randUserName(),
        avatar_url: null,
      },
      participants: [],
    });
  }),
  http.get(tableUrl("word_pools"), () =>
    HttpResponse.json<
      typeof roundApi.endpoints.getWordPool.Types.RawResultType
    >({
      words: randWordPool(),
    }),
  ),
);

export const Route = createFileRoute("/game/$inviteCode")({
  async loader({ params: { inviteCode }, context: { store } }) {
    const game = await store
      .dispatch(gameApi.endpoints.getGameByInviteCode.initiate(inviteCode))
      .unwrap();
    return { game };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { inviteCode } = Route.useParams();
  const { game } = useGetGameByInviteCodeQuery(inviteCode, {
    selectFromResult: ({ data }) => ({ game: data }),
  });
  const roundId = 1;
  const userId = "1";
  if (!game) return null;
  return (
    <>
      <CurrentSubmission gameId={game.id} roundId={roundId} userId={userId} />
      <WordPool gameId={game.id} roundId={roundId} userId={userId} />
    </>
  );
}
