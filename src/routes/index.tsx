import { createFileRoute } from "@tanstack/react-router";
import { AppBar } from "@/components/app-bar";
import { Logout } from "@/features/auth/Logout";
import { ensureAuthenticated } from "@/features/auth/user";
import { CreateGame } from "@/features/game/CreateGame";
import { JoinGame } from "@/features/game/JoinGame";
import { ProfileDialog } from "@/features/profile/ProfileDialog";
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
    <>
      <AppBar
        actions={
          <>
            <ProfileDialog />
            <Logout />
          </>
        }
      />
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
    </>
  );
}
