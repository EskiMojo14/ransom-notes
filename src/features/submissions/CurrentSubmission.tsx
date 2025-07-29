import { clsx } from "clsx";
import { radEventListeners } from "rad-event-listeners";
import { useEffect, useRef } from "react";
import {
  Button as AriaButton,
  RadioGroup,
  Toolbar,
} from "react-aria-components";
import { Button } from "@/components/button";
import { Radio } from "@/components/radio";
import { Symbol } from "@/components/symbol";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useGetWordPoolQuery } from "@/features/round/api";
import {
  clearSubmission,
  nextRow,
  prevRow,
  rowAdded,
  rowRemoved,
  rowSelected,
  selectCurrentRow,
  selectRows,
  wordDeselected,
} from "./slice";
import styles from "./CurrentSubmission.module.css";
import poolStyles from "./WordPool.module.css";

export interface CurrentSubmissionProps {
  gameId: number;
  roundId: number;
  userId: string;
}

const digitRegex = /\d/;

export function CurrentSubmission(props: CurrentSubmissionProps) {
  const dispatch = useAppDispatch();
  const { words = [] } = useGetWordPoolQuery(props, {
    selectFromResult: ({ data }) => ({ words: data }),
  });
  const rows = useAppSelector(selectRows);
  const currentRow = useAppSelector(selectCurrentRow);
  const radioRefs = useRef<Array<HTMLInputElement | null>>([]);
  useEffect(
    () =>
      radEventListeners(document, {
        keydown({ key }) {
          if (key === "ArrowUp") {
            dispatch(prevRow());
          } else if (key === "ArrowDown") {
            dispatch(nextRow());
          } else if (digitRegex.test(key)) {
            dispatch(rowSelected(parseInt(key) - 1));
          }
        },
      }),
    [dispatch],
  );
  return (
    <div className={styles.submission}>
      <RadioGroup
        name="row"
        value={currentRow.toString()}
        onChange={(value) => dispatch(rowSelected(parseInt(value)))}
        className={styles.rows}
      >
        {rows.map((row, rowIndex) => (
          <div
            // eslint-disable-next-line @eslint-react/no-array-index-key
            key={rowIndex}
            className={clsx(
              styles.row,
              currentRow === rowIndex && styles.currentRow,
            )}
            onClick={() => {
              radioRefs.current[rowIndex]?.click();
            }}
          >
            <Radio
              value={rowIndex.toString()}
              aria-label={`Select row ${rowIndex}`}
              inputRef={{
                get current() {
                  return radioRefs.current[rowIndex] ?? null;
                },
                set current(ref) {
                  radioRefs.current[rowIndex] = ref;
                },
              }}
            />
            <Toolbar className={styles.words}>
              {row.map((wordIndex) => (
                <AriaButton
                  key={wordIndex}
                  className={clsx("body1", poolStyles.wordButton)}
                  onPress={() =>
                    dispatch(wordDeselected({ rowIndex, wordIndex }))
                  }
                >
                  {words[wordIndex]}
                </AriaButton>
              ))}
            </Toolbar>
            <Button
              className={clsx("body1", styles.removeRow)}
              onPress={() => dispatch(rowRemoved(rowIndex))}
              variant="outlined"
              iconOnly
              icon={<Symbol>variable_remove</Symbol>}
              color="error"
            >
              Remove row
            </Button>
          </div>
        ))}
      </RadioGroup>
      <Toolbar className={styles.toolbar}>
        <Button
          className={styles.clearSubmission}
          onPress={() => dispatch(clearSubmission())}
          icon={<Symbol>clear</Symbol>}
          variant="outlined"
          color="error"
        >
          Clear
        </Button>
        <Button
          onPress={() => dispatch(rowAdded())}
          icon={<Symbol>variable_add</Symbol>}
          variant="filled"
        >
          Add row
        </Button>
      </Toolbar>
    </div>
  );
}
