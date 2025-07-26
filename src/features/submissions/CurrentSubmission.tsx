import { clsx } from "clsx";
import { useRef } from "react";
import {
  Button as AriaButton,
  Radio,
  RadioGroup,
  Toolbar,
} from "react-aria-components";
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
import poolStyles from "./WordPool.module.css";

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
  const radioRefs = useRef<Array<HTMLInputElement | null>>([]);
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
            className={styles.row}
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
            >
              {({ isSelected }) => (
                <input type="radio" checked={isSelected} readOnly />
              )}
            </Radio>
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
