import { Route } from "@/routes/game/$inviteCode";
import { useGetGameByInviteCodeQuery } from "./api";

export function useGameId() {
  const { inviteCode } = Route.useParams();
  const { gameId } = useGetGameByInviteCodeQuery(inviteCode, {
    selectFromResult: ({ data }) => ({ gameId: data?.id }),
  });
  return gameId;
}
