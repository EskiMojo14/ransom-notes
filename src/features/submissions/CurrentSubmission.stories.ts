import type { Meta, StoryObj } from "@storybook/react-vite";
import { delay, http, HttpResponse } from "msw";
import { transformGame } from "@/features/game/api";
import type { roundApi } from "@/features/round/api";
import { getStore, withSession } from "@/storybook/decorators";
import {
  mockGame,
  randIndexes,
  randRawGame,
  randWordPool,
} from "@/storybook/mocks";
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

const game = randRawGame();

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
    router: {
      currentRoute: {
        path: "/game/$inviteCode",
        params: { inviteCode: game.invite_code },
        routes: [
          { path: "/game" },
          { path: "/$inviteCode", loaderData: { game: transformGame(game) } },
        ],
      },
    },
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
        mockGame({ game }),
      ],
    },
  },
  decorators: [withSession],
} satisfies Meta<typeof CurrentSubmission>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
