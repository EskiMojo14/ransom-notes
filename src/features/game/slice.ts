import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import type { Enums, TablesInsert } from "@/supabase/types";

export type VotingMode = Enums<"voting_mode">;

interface GameSlice {
  firstTo: number;
  poolSize: number;
  maxSubmissionLength: number;
  votingMode: VotingMode;
}

type ConfigTuples = {
  [K in keyof GameSlice]: [K, GameSlice[K]];
}[keyof GameSlice];

const initialState: GameSlice = {
  firstTo: 3,
  poolSize: 60,
  maxSubmissionLength: 16,
  votingMode: "judge",
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: (create) => ({
    configChanged: create.preparedReducer(
      (...payload: ConfigTuples) => ({ payload }),
      (state, { payload }) => {
        const [key, value] = payload;
        state[key] = value as never;
      },
    ),
  }),
  selectors: {
    selectFirstTo: (state) => state.firstTo,
    selectPoolSize: (state) => state.poolSize,
    selectMaxSubmissionLength: (state) => state.maxSubmissionLength,
    selectVotingMode: (state) => state.votingMode,
  },
});

export const {
  actions: { configChanged },
  selectors: {
    selectFirstTo,
    selectPoolSize,
    selectMaxSubmissionLength,
    selectVotingMode,
  },
} = gameSlice;

export const selectGameConfig = (state: RootState) => {
  return {
    first_to: selectFirstTo(state),
    max_submission_length: selectMaxSubmissionLength(state),
    pool_size: selectPoolSize(state),
    voting_mode: selectVotingMode(state),
  } satisfies Omit<TablesInsert<"games">, "creator" | "id" | "invite_code">;
};
