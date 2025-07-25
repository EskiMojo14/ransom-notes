import { clsx } from "clsx";
import { Button as AriaButton, Checkbox } from "react-aria-components";
import { Button } from "@/components/button";
import { Symbol } from "@/components/symbol";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useGetWordPoolQuery } from "../round/api";
import {
  clearSubmission,
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
      <Button
        className={clsx("body1", styles.clearSubmission)}
        onPress={() => dispatch(clearSubmission())}
        icon={<Symbol>clear</Symbol>}
        variant="outlined"
      >
        Clear
      </Button>
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
              <AriaButton
                key={wordIndex}
                className={clsx("body1", styles.word)}
                onPress={() =>
                  dispatch(wordDeselected({ rowIndex, wordIndex }))
                }
              >
                {words[wordIndex]}
              </AriaButton>
            ))}
          </div>
          <Button
            className={clsx("body1", styles.removeRow)}
            onPress={() => dispatch(rowRemoved(rowIndex))}
            aria-label="Remove row"
            variant="outlined"
            iconOnly
            icon={<Symbol>remove</Symbol>}
          />
        </div>
      ))}

      <Button
        className={clsx("body1", styles.addRow)}
        onPress={() => dispatch(rowAdded())}
        icon={<Symbol>add</Symbol>}
        variant="outlined"
      >
        Add row
      </Button>
    </div>
  );
}
