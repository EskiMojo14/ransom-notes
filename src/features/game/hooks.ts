import { Route } from "@/routes/game.$inviteCode";

export function useGameId() {
  const gameId = Route.useLoaderData({
    select: ({ game }) => game.id,
  });
  return gameId;
}
