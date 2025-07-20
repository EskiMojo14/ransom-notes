import styles from "./Words.module.css";

export interface WordsProps {
  words: Array<string>;
}

export function Words({ words }: WordsProps) {
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
