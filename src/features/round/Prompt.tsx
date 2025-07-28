import { useGetActiveRoundQuery } from "./api";
import styles from "./Prompt.module.css";

export interface PromptProps {
  gameId: number;
}

export function Prompt({ gameId }: PromptProps) {
  const { prompt } = useGetActiveRoundQuery(gameId, {
    selectFromResult: ({ data }) => ({ prompt: data?.prompt }),
  });
  return (
    <div className={styles.prompt}>
      <h5 className={styles.text}>{prompt}</h5>
    </div>
  );
}
