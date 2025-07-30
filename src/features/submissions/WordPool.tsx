import { clsx } from "clsx";
import { ToggleButton, ToggleButtonGroup } from "react-aria-components";
import { useSession } from "@/features/auth/session";
import type { Game } from "@/features/game/api";
import type { Round } from "@/features/round/api";
import {
  useGetActiveRoundQuery,
  useGetWordPoolQuery,
} from "@/features/round/api";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { selectAllIndexes, wordToggled } from "./slice";
import styles from "./WordPool.module.css";

export interface WordPoolProps {
  gameId: Game["id"];
  roundId: Round["id"];
}

export function WordPool({ gameId, roundId }: WordPoolProps) {
  const dispatch = useAppDispatch();
  const session = useSession();
  const { words = [] } = useGetWordPoolQuery(
    { gameId, roundId, userId: session.user.id },
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
