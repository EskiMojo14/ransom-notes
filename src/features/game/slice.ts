import { createSlice } from "@reduxjs/toolkit";
import type { Enums } from "@/supabase/types";

export type VotingMode = Enums<"voting_mode">;

interface GameSlice {
  lang: string;
  poolSize: number;
  maxSubmissionLength: number;
  votingMode: VotingMode;
}

const initialState: GameSlice = {
  lang: "en",
  poolSize: 60,
  maxSubmissionLength: 16,
  votingMode: "judge",
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: (create) => ({
    langChanged: create.reducer<string>((state, { payload }) => {
      state.lang = payload;
    }),
    poolSizeChanged: create.reducer<number>((state, { payload }) => {
      state.poolSize = payload;
    }),
    maxSubmissionLengthChanged: create.reducer<number>((state, { payload }) => {
      state.maxSubmissionLength = payload;
    }),
    votingModeChanged: create.reducer<VotingMode>((state, { payload }) => {
      state.votingMode = payload;
    }),
  }),
  selectors: {
    selectLang: (state) => state.lang,
    selectPoolSize: (state) => state.poolSize,
    selectMaxSubmissionLength: (state) => state.maxSubmissionLength,
    selectVotingMode: (state) => state.votingMode,
  },
});

export const {
  actions: {
    langChanged,
    poolSizeChanged,
    maxSubmissionLengthChanged,
    votingModeChanged,
  },
  selectors: {
    selectLang,
    selectPoolSize,
    selectMaxSubmissionLength,
    selectVotingMode,
  },
} = gameSlice;
