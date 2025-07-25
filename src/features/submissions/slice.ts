import { createSelector, createSlice } from "@reduxjs/toolkit";
import { assert } from "@/utils";
import { roundApi } from "../round/api";

interface SubmissionState {
  rows: Array<Array<number>>;
  // map from word indexes to their row index, to avoid needing to search every row
  reverse: Record<number, number>;
  currentRow: number;
}

const initialState: SubmissionState = {
  rows: [[], [], []],
  reverse: {},
  currentRow: 0,
};

function removeWord(
  state: SubmissionState,
  rowIndex: number,
  wordIndex: number,
) {
  const row = state.rows[rowIndex];
  assert(row, "Row should exist");
  const wordIdx = row.indexOf(wordIndex);
  assert(wordIdx !== -1, "Word should be in row");
  row.splice(wordIdx, 1);
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete state.reverse[wordIndex];
}

export const submissionSlice = createSlice({
  name: "submission",
  initialState,
  reducers: (create) => ({
    wordToggled: create.reducer<number>((state, { payload }) => {
      const rowIdx = state.reverse[payload];
      if (typeof rowIdx === "number") {
        removeWord(state, rowIdx, payload);
      } else {
        const currentRow = state.rows[state.currentRow];
        assert(currentRow, "Current row should exist");
        currentRow.push(payload);
        state.reverse[payload] = state.currentRow;
      }
    }),
    wordDeselected: create.reducer<{ rowIndex: number; wordIndex: number }>(
      (state, { payload: { rowIndex, wordIndex } }) => {
        removeWord(state, rowIndex, wordIndex);
      },
    ),
    rowSelected: create.reducer<number>((state, action) => {
      assert(state.rows[action.payload], "Row should exist");
      state.currentRow = action.payload;
    }),
    rowAdded: create.reducer((state) => {
      state.rows.push([]);
      state.currentRow = state.rows.length - 1;
    }),
    rowRemoved: create.reducer<number>((state, { payload }) => {
      const row = state.rows[payload];
      assert(row, "Row should exist");
      row.forEach((wordIndex) => {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete state.reverse[wordIndex];
      });
      state.rows.splice(payload, 1);
      state.currentRow = Math.min(state.currentRow, state.rows.length - 1);
    }),
    clearSubmission: create.reducer(() => initialState),
  }),
  extraReducers(builder) {
    // our indexes will be out of date, clear submission
    builder.addMatcher(
      roundApi.endpoints.getWordPool.matchFulfilled,
      () => initialState,
    );
  },
  selectors: {
    selectRows: (state) => state.rows,
    selectCurrentRow: (state) => state.currentRow,
  },
});

export const {
  actions: {
    wordToggled,
    wordDeselected,
    rowSelected,
    rowAdded,
    rowRemoved,
    clearSubmission,
  },
  selectors: { selectRows, selectCurrentRow },
} = submissionSlice;

export const selectJoinedRows = createSelector(
  selectRows,
  (wordPool: Array<string>) => wordPool,
  (rows, wordPool) =>
    rows.map((row) => row.map((wordIndex) => wordPool[wordIndex]).join(" ")),
);

export const selectAllIndexes = createSelector(
  selectRows,
  (rows) => new Set(rows.flat()),
);
