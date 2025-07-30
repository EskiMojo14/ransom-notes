import { Route } from "@/routes/game/$inviteCode";

export function useGameId() {
  const { gameId } = Route.useLoaderData({
    select: ({ game }) => ({ gameId: game.id }),
  });
  return gameId;
}
