import { clsx } from "clsx";
import { ToggleButton, ToggleButtonGroup } from "react-aria-components";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useGetActiveRoundQuery, useGetWordPoolQuery } from "../round/api";
import { selectAllIndexes, wordToggled } from "./slice";
import styles from "./WordPool.module.css";

export interface WordPoolProps {
  gameId: number;
  roundId: number;
  userId: string;
}

export function WordPool({ gameId, roundId, userId }: WordPoolProps) {
  const dispatch = useAppDispatch();
  const { words = [] } = useGetWordPoolQuery(
    { gameId, roundId, userId },
    {
      selectFromResult: ({ data }) => ({ words: data }),
    },
  );
  const { phase } = useGetActiveRoundQuery(gameId, {
    selectFromResult: ({ data }) => ({ phase: data?.phase }),
  });
  const selectedKeys = useAppSelector(selectAllIndexes);
  return (
    <ToggleButtonGroup
      className={styles.group}
      selectionMode="multiple"
      selectedKeys={selectedKeys}
      isDisabled={phase !== "submission"}
    >
      {words.map((word, index) => (
        <ToggleButton
          // necessary - words may appear twice
          // eslint-disable-next-line @eslint-react/no-array-index-key
          key={`${word}-${index}`}
          className={clsx(styles.wordButton, "body1")}
          onChange={() => dispatch(wordToggled(index))}
          isDisabled={phase !== "submission"}
        >
          {word}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
