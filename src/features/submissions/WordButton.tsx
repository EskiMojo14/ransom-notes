import { clsx } from "clsx";
import { ToggleButton, ToggleButtonGroup } from "react-aria-components";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useGetWordPoolQuery } from "../round/api";
import { selectAllIndexes, wordToggled } from "./slice";
import styles from "./WordButton.module.css";

export interface WordButtonProps {
  wordIndex: number;
  word: string;
}

export function WordToggleButton({ wordIndex, word }: WordButtonProps) {
  const dispatch = useAppDispatch();
  return (
    <ToggleButton
      key={wordIndex}
      className={clsx(styles.wordButton, "body1")}
      onChange={() => dispatch(wordToggled(wordIndex))}
    >
      {word}
    </ToggleButton>
  );
}

export interface WordToggleButtonGroupProps {
  gameId: number;
  roundId: number;
  userId: string;
}

export function WordToggleButtonGroup(props: WordToggleButtonGroupProps) {
  const { words = [] } = useGetWordPoolQuery(props, {
    selectFromResult: ({ data }) => ({ words: data }),
  });
  const selectedKeys = useAppSelector(selectAllIndexes);
  return (
    <ToggleButtonGroup
      className={styles.group}
      selectionMode="multiple"
      selectedKeys={selectedKeys}
    >
      {words.map((word, index) => (
        <WordToggleButton
          // eslint-disable-next-line @eslint-react/no-array-index-key
          key={`${word}-${index}`}
          wordIndex={index}
          word={word}
        />
      ))}
    </ToggleButtonGroup>
  );
}
