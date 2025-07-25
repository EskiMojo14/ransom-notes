import { clsx } from "clsx";
import { ToggleButton } from "react-aria-components";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useGetWordPoolQuery } from "../round/api";
import { selectWordIsSelected, wordToggled } from "./slice";
import styles from "./WordButton.module.css";

export interface WordButtonProps {
  wordIndex: number;
  gameId: number;
  roundId: number;
  userId: string;
}

export function WordToggleButton({ wordIndex, ...props }: WordButtonProps) {
  const dispatch = useAppDispatch();
  const { word } = useGetWordPoolQuery(props, {
    selectFromResult: ({ data }) => ({
      word: data?.[wordIndex],
    }),
  });
  const isSelected = useAppSelector((state) =>
    selectWordIsSelected(state, wordIndex),
  );
  return (
    <ToggleButton
      className={clsx(styles.wordButton, "body1")}
      isSelected={isSelected}
      onChange={() => dispatch(wordToggled(wordIndex))}
    >
      {word}
    </ToggleButton>
  );
}
