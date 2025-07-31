import { skipToken } from "@reduxjs/toolkit/query";
import { useState } from "react";
import { LinkButton } from "@/components/button/link";
import { Symbol } from "@/components/symbol";
import { InlineTextField } from "@/components/textfield/inline";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { Enums } from "@/supabase/types";
import { useGetGameStateQuery } from "./api";
import styles from "./JoinGame.module.css";

const errorMessage: Partial<Record<Enums<"game_state">, string>> = {
  running: "Game has already started",
  finished: "Game has already finished",
};

function getErrorMessage(
  state: Enums<"game_state"> | undefined,
  status: number | undefined,
) {
  if (status === 406) return "Game not found";
  return state && state !== "open" ? errorMessage[state] : undefined;
}

export interface JoinGameProps {
  inviteCode?: string;
}

export function JoinGame({
  inviteCode: initialInviteCode = "",
}: JoinGameProps) {
  const [inviteCode, setInviteCode] = useState(initialInviteCode);
  const debouncedInviteCode = useDebouncedValue(inviteCode);
  const { state, status } = useGetGameStateQuery(
    debouncedInviteCode || skipToken,
    {
      selectFromResult: ({ data, error }) => ({
        state: data,
        status: error && "status" in error ? error.status : undefined,
      }),
    },
  );
  const errorMessage = getErrorMessage(state, status);
  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <InlineTextField
          label="Invite code"
          placeholder="Enter code"
          value={inviteCode}
          onChange={setInviteCode}
          isInvalid={!!errorMessage}
          errorMessage={errorMessage}
          icon={<Symbol>password_2</Symbol>}
          className={styles.inviteCode}
        />
        <LinkButton
          to="/game/$inviteCode"
          params={{ inviteCode }}
          variant="elevated"
          icon={
            <Symbol>{state === "open" ? "door_open" : "door_front"}</Symbol>
          }
          isDisabled={state !== "open"}
        >
          Join
        </LinkButton>
      </div>
    </div>
  );
}
