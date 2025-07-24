import { clsx } from "clsx";
import styles from "./Submission.module.css";

export interface SubmissionProps {
  rows: Array<string>;
}

export function Submission({ rows }: SubmissionProps) {
  return (
    <div className={styles.submission}>
      {rows.map((row, index) => (
        // eslint-disable-next-line @eslint-react/no-array-index-key
        <div key={index} className={styles.row}>
          {row.split(" ").map((word, index) => (
            // eslint-disable-next-line @eslint-react/no-array-index-key
            <span key={index} className={clsx("body1", styles.word)}>
              {word}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
