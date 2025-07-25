import { createSelector, createSlice } from "@reduxjs/toolkit";
import { assert } from "@/utils";

interface SubmissionState {
  rows: Array<Array<number>>;
  currentRow: number;
}

const initialState: SubmissionState = {
  rows: [[], [], []],
  currentRow: 0,
};

export const submissionSlice = createSlice({
  name: "submission",
  initialState,
  reducers: (create) => ({
    wordToggled: create.reducer<number>((state, { payload }) => {
      const row = state.rows.find((row) => row.includes(payload));
      if (row) {
        row.splice(row.indexOf(payload), 1);
      } else {
        const currentRow = state.rows[state.currentRow];
        assert(currentRow, "Current row should exist");
        currentRow.push(payload);
      }
    }),
    wordDeselected: create.reducer<{ rowIndex: number; wordIndex: number }>(
      (state, { payload }) => {
        const row = state.rows[payload.rowIndex];
        assert(row, "Row should exist");
        row.splice(row.indexOf(payload.wordIndex), 1);
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
      state.rows.splice(payload, 1);
      state.currentRow = Math.min(state.currentRow, state.rows.length - 1);
    }),
  }),
  selectors: {
    selectRows: (state) => state.rows,
    selectCurrentRow: (state) => state.currentRow,
  },
});

export const {
  actions: { wordToggled, rowSelected, rowAdded, rowRemoved },
  selectors: { selectRows, selectCurrentRow },
} = submissionSlice;

export const selectAllIndexes = createSelector(
  selectRows,
  (rows) => new Set(rows.flat()),
);

export const selectWordIsSelected = createSelector(
  selectAllIndexes,
  (_: unknown, wordIndex: number) => wordIndex,
  (indexes, wordIndex) => indexes.has(wordIndex),
);
