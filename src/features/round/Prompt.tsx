import { useGetActiveRoundQuery } from "./api";
import styles from "./Prompt.module.css";

export interface PromptProps {
  gameId: number;
}

export function Prompt({ gameId }: PromptProps) {
  const { question } = useGetActiveRoundQuery(gameId, {
    selectFromResult: ({ data }) => ({ question: data?.question }),
  });
  return (
    <div className={styles.prompt}>
      <h5 className={styles.text}>{question}</h5>
    </div>
  );
}
