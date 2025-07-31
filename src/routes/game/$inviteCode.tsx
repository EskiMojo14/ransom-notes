import { createFileRoute } from "@tanstack/react-router";
import { ensureAuthenticated } from "@/features/auth/user";
import { Chat } from "@/features/chat/Chat";
import { gameApi, useGetGameByInviteCodeQuery } from "@/features/game/api";
import { Prompt } from "@/features/round/Prompt";
import { CurrentSubmission } from "@/features/submissions/CurrentSubmission";
import { WordPool } from "@/features/submissions/WordPool";
import styles from "./$inviteCode.css?url";

export const Route = createFileRoute("/game/$inviteCode")({
  head: () => ({
    links: [
      {
        rel: "stylesheet",
        href: styles,
      },
    ],
  }),
  beforeLoad: ensureAuthenticated,
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
    <div className="game">
      <main>
        <Prompt />
        <CurrentSubmission />
        <WordPool />
      </main>
      <aside>
        <Chat />
      </aside>
    </div>
  );
}
