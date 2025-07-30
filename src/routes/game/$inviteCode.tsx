import { randRecentDate, randUserName } from "@ngneat/falso";
import { createFileRoute } from "@tanstack/react-router";
import { http, HttpResponse } from "msw";
import { env } from "@/env";
import { ensureAuthenticated } from "@/features/auth/user";
import { gameApi, useGetGameByInviteCodeQuery } from "@/features/game/api";
import type { roundApi } from "@/features/round/api";
import { Prompt } from "@/features/round/Prompt";
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
          prompt: { prompt: randQuestion() },
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
      creator_id: "1",
      creator: {
        display_name: randUserName(),
        avatar_url: null,
      },
      first_to: 5,
      state: "running",
      voting_mode: "judge",
      created_at: randRecentDate().toISOString(),
      active_round: 1,
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
  async beforeLoad() {
    if (!env.VITE_USE_MOCKS) await ensureAuthenticated();
  },
  async loader({ params: { inviteCode }, context: { store } }) {
    const sub = store.dispatch(
      gameApi.endpoints.getGameByInviteCode.initiate(inviteCode),
    );
    try {
      return { game: await sub.unwrap() };
    } finally {
      sub.unsubscribe();
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { inviteCode } = Route.useParams();
  const { game } = useGetGameByInviteCodeQuery(inviteCode, {
    selectFromResult: ({ data }) => ({ game: data }),
  });
  if (!game) return null;
  return (
    <>
      <Prompt />
      <CurrentSubmission />
      <WordPool />
    </>
  );
}
