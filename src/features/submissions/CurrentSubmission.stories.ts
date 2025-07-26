import { randRecentDate } from "@ngneat/falso";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { delay, http, HttpResponse } from "msw";
import type { MswParameters } from "msw-storybook-addon";
import { getStore, withRedux } from "@/storybook/decorators";
import { randIndexes, randQuestion, randWordPool } from "@/storybook/mocks";
import { tableUrl } from "@/supabase/mocks";
import type { roundApi } from "../round/api";
import { CurrentSubmission } from "./CurrentSubmission";
import { clearSubmission, rowSelected, wordToggled } from "./slice";

const wordPool = randWordPool();
const idxs = Array.from(randIndexes(wordPool.length, 9));
const perRow = Math.ceil(idxs.length / 3);
const rows = [
  idxs.slice(0, perRow),
  idxs.slice(perRow, perRow * 2),
  idxs.slice(perRow * 2),
];

const meta = {
  component: CurrentSubmission,
  title: "Features/Submissions/CurrentSubmission",
  args: {
    gameId: 1,
    roundId: 1,
    userId: "1",
  },
  async play({ parameters }) {
    const store = getStore(parameters);

    store.dispatch(clearSubmission());

    // make sure the word pool is loaded
    await delay();
    for (const [rowIndex, row] of rows.entries()) {
      store.dispatch(rowSelected(rowIndex));
      for (const wordIndex of row) {
        await delay(150);
        store.dispatch(wordToggled(wordIndex));
      }
    }
  },
  parameters: {
    msw: {
      handlers: {
        wordPool: http.get(tableUrl("word_pools"), () =>
          HttpResponse.json<
            typeof roundApi.endpoints.getWordPool.Types.RawResultType
          >({
            words: wordPool,
          }),
        ),
        activeRound: http.get(tableUrl("games"), () =>
          HttpResponse.json<
            typeof roundApi.endpoints.getActiveRound.Types.RawResultType
          >({
            active_round: {
              id: 1,
              question: randQuestion(),
              judge: null,
              created_at: randRecentDate().toISOString(),
              phase: "submission",
            },
          }),
        ),
      },
    },
  } satisfies MswParameters,
  decorators: [withRedux],
} satisfies Meta<typeof CurrentSubmission>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
