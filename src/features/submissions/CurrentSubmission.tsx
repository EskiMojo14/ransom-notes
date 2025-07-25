import { clsx } from "clsx";
import { Button, Checkbox } from "react-aria-components";
import { Symbol } from "@/components/symbol";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useGetWordPoolQuery } from "../round/api";
import {
  rowAdded,
  rowRemoved,
  rowSelected,
  selectCurrentRow,
  selectRows,
  wordDeselected,
} from "./slice";
import styles from "./CurrentSubmission.module.css";

export interface CurrentSubmissionProps {
  gameId: number;
  roundId: number;
  userId: string;
}

export function CurrentSubmission(props: CurrentSubmissionProps) {
  const dispatch = useAppDispatch();
  const { words = [] } = useGetWordPoolQuery(props, {
    selectFromResult: ({ data }) => ({ words: data }),
  });
  const rows = useAppSelector(selectRows);
  const currentRow = useAppSelector(selectCurrentRow);
  return (
    <div className={styles.submission}>
      {rows.map((row, rowIndex) => (
        // eslint-disable-next-line @eslint-react/no-array-index-key
        <div key={rowIndex} className={styles.row}>
          <Checkbox
            name="row"
            isSelected={rowIndex === currentRow}
            onChange={() => dispatch(rowSelected(rowIndex))}
          >
            {({ isSelected }) => (
              <input type="radio" checked={isSelected} readOnly />
            )}
          </Checkbox>
          <div className={styles.words}>
            {row.map((wordIndex) => (
              <Button
                key={wordIndex}
                className={clsx("body1", styles.word)}
                onPress={() =>
                  dispatch(wordDeselected({ rowIndex, wordIndex }))
                }
              >
                {words[wordIndex]}
              </Button>
            ))}
          </div>
          <Button
            className={clsx("body1", styles.removeRow)}
            onPress={() => dispatch(rowRemoved(rowIndex))}
            aria-label="Remove row"
          >
            <Symbol>remove</Symbol>
          </Button>
        </div>
      ))}

      <Button
        className={clsx("body1", styles.addRow)}
        onPress={() => dispatch(rowAdded())}
        aria-label="Add row"
      >
        <Symbol>add</Symbol>
      </Button>
    </div>
  );
}
