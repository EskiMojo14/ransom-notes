import { clsx } from "clsx";
import type { Round } from "@/features/round/api";
import { selectSubmissionById, useGetSubmissionsQuery } from "./api";
import styles from "./Submission.module.css";

export interface SubmissionProps {
  roundId: Round["id"];
  authorId: string;
  showAuthor?: boolean;
}

export function Submission({
  roundId,
  authorId,
  showAuthor = true,
}: SubmissionProps) {
  const { submission } = useGetSubmissionsQuery(roundId, {
    selectFromResult: ({ data }) => ({
      submission: data && selectSubmissionById(data, authorId),
    }),
  });
  if (!submission) {
    return null;
  }
  return (
    <div className={styles.submission}>
      <div className={styles.rows}>
        {submission.rows.map((row, index) => (
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
      {showAuthor && (
        <div className={clsx("subtitle1", styles.author)}>
          {submission.author.display_name}
        </div>
      )}
    </div>
  );
}
