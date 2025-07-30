import type { Meta, StoryObj } from "@storybook/react-vite";
import { delay, http, HttpResponse } from "msw";
import type { MswParameters } from "msw-storybook-addon";
import type { roundApi } from "@/features/round/api";
import type { SessionParameters } from "@/storybook/decorators";
import { getStore, withRedux, withSession } from "@/storybook/decorators";
import { mockGame, randIndexes, randWordPool } from "@/storybook/mocks";
import { mockSession, tableUrl } from "@/supabase/mocks";
import { CurrentSubmission } from "./CurrentSubmission";
import { clearSubmission, wordToggled } from "./slice";

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
  async play({ parameters, userEvent }) {
    const store = getStore(parameters);

    store.dispatch(clearSubmission());

    // make sure the word pool is loaded
    await delay();
    for (const row of rows) {
      for (const wordIndex of row) {
        await delay(150);
        store.dispatch(wordToggled(wordIndex));
      }
      await userEvent.keyboard("{ArrowDown}");
    }
  },
  parameters: {
    session: mockSession(),
    msw: {
      handlers: [
        http.get(tableUrl("word_pools"), () =>
          HttpResponse.json<
            typeof roundApi.endpoints.getWordPool.Types.RawResultType
          >({
            words: wordPool,
          }),
        ),
        mockGame(),
      ],
    },
  } satisfies MswParameters & SessionParameters,
  decorators: [withRedux, withSession],
} satisfies Meta<typeof CurrentSubmission>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
