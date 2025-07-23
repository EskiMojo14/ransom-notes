import { createFileRoute } from "@tanstack/react-router";
import { gameApi } from "@/features/game/api";

export const Route = createFileRoute("/game/$inviteCode")({
  async loader({ params: { inviteCode }, context: { store } }) {
    const game = await store
      .dispatch(gameApi.endpoints.getGameByInviteCode.initiate(inviteCode))
      .unwrap();
    return { game };
  },
});
