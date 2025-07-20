import { useGetWordPoolQuery } from "./api";
import styles from "./Words.module.css";

export interface WordsProps {
  gameId: number;
  userId: string;
}

export function Words({ gameId, userId }: WordsProps) {
  const { data: words = [] } = useGetWordPoolQuery({ gameId, userId });
  return (
    <div className={styles.wordCollection}>
      {words.map((word) => (
        <span key={word} className={styles.word}>
          {word}
        </span>
      ))}
    </div>
  );
}
