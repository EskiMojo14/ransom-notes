import { skipToken } from "@reduxjs/toolkit/query";
import { useGameId } from "@/features/game/hooks";
import { useGetActiveRoundQuery } from "./api";
import styles from "./Prompt.module.css";

export function Prompt() {
  const gameId = useGameId();
  const { prompt } = useGetActiveRoundQuery(gameId ?? skipToken, {
    selectFromResult: ({ data }) => ({ prompt: data?.prompt }),
  });
  return (
    <div className={styles.prompt}>
      <h5 className={styles.text}>{prompt}</h5>
    </div>
  );
}
