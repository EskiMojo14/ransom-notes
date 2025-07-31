import { createFileRoute } from "@tanstack/react-router";
import { ensureAuthenticated } from "@/features/auth/user";
import { CreateGame } from "@/features/game/CreateGame";
import { JoinGame } from "@/features/game/JoinGame";
import styles from "./index.css?url";

export const Route = createFileRoute("/")({
  head: () => ({
    links: [
      {
        rel: "stylesheet",
        href: styles,
      },
    ],
  }),
  async beforeLoad() {
    await ensureAuthenticated();
  },
  component: App,
});

function App() {
  return (
    <main>
      <div className="forms">
        <div className="form">
          <h2 className="headline4">Join game</h2>
          <JoinGame />
        </div>
        <div className="form">
          <h2 className="headline4">Create game</h2>
          <CreateGame />
        </div>
      </div>
    </main>
  );
}
