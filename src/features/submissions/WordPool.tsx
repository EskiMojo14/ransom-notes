import { skipToken } from "@reduxjs/toolkit/query";
import { clsx } from "clsx";
import { ToggleButton, ToggleButtonGroup } from "react-aria-components";
import { useSession } from "@/features/auth/session";
import { useGameId } from "@/features/game/hooks";
import {
  useGetActiveRoundQuery,
  useGetWordPoolQuery,
} from "@/features/round/api";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { selectAllIndexes, wordToggled } from "./slice";
import styles from "./WordPool.module.css";

export function WordPool() {
  const dispatch = useAppDispatch();
  const gameId = useGameId();
  const session = useSession();
  const { words = [] } = useGetWordPoolQuery(
    gameId != null ? { gameId, userId: session.user.id } : skipToken,
    {
      selectFromResult: ({ data }) => ({ words: data }),
    },
  );
  const { phase } = useGetActiveRoundQuery(gameId ?? skipToken, {
    selectFromResult: ({ data }) => ({ phase: data?.phase }),
  });
  const selectedKeys = useAppSelector(selectAllIndexes);
  return (
    <ToggleButtonGroup
      className={styles.pool}
      selectionMode="multiple"
      selectedKeys={selectedKeys}
      onSelectionChange={(newKeys) => {
        const diff = newKeys.symmetricDifference(selectedKeys);
        diff.forEach((key) => dispatch(wordToggled(Number(key))));
      }}
      isDisabled={phase !== "submission"}
    >
      {words.map((word, index) => (
        <ToggleButton
          // necessary - words may appear twice
          // eslint-disable-next-line @eslint-react/no-array-index-key
          key={`${word}-${index}`}
          id={index}
          className={clsx(styles.wordButton, "body1")}
          isDisabled={phase !== "submission"}
        >
          {word}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
