import { randParagraph, randSentence } from "@ngneat/falso";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { delay, http, HttpResponse } from "msw";
import type { MswParameters } from "msw-storybook-addon";
import type { Canvas } from "storybook/internal/csf";
import type { UserEvent } from "storybook/internal/test";
import { makeStore } from "@/store";
import type { ReduxParameters } from "@/storybook/decorators";
import { withRedux } from "@/storybook/decorators";
import { tableUrl } from "@/supabase/mocks";
import type { Enums } from "@/supabase/types";
import { assert } from "@/utils";
import { roundApi } from "../round/api";
import { WordPool } from "./WordButton";

const meta = {
  component: WordPool,
  title: "Features/Submissions/WordPool",
  args: {
    gameId: 1,
    roundId: 1,
    userId: "1",
  },
  parameters: {
    msw: {
      handlers: {
        wordPool: http.get(tableUrl("word_pools"), () =>
          HttpResponse.json<
            typeof roundApi.endpoints.getWordPool.Types.RawResultType
          >({
            words: randParagraph()
              .replace(/[^a-zA-Z\s]/g, "")
              .toLowerCase()
              .split(" "),
          }),
        ),
        activeRound: http.get(tableUrl("games"), () =>
          HttpResponse.json<
            typeof roundApi.endpoints.getActiveRound.Types.RawResultType
          >({
            active_round: {
              id: 1,
              question: randSentence().replace(".", "?"),
              judge: null,
              created_at: "2024-01-01T00:00:00Z",
              phase: "submission",
            },
          }),
        ),
      },
    },
  } satisfies MswParameters,
  decorators: [withRedux],
} satisfies Meta<typeof WordPool>;

export default meta;
type Story = StoryObj<typeof meta>;

const numberUpTo = (max: number) => Math.ceil(Math.random() * max);

async function selectRandomWords(
  canvas: Canvas,
  userEvent: ReturnType<UserEvent["userEvent"]["setup"]>,
  count: number,
) {
  const buttons = await canvas.findAllByRole("button");
  const clicked = new Set<number>();
  while (clicked.size < count) {
    const idx = numberUpTo(buttons.length - 1);
    if (!clicked.has(idx)) {
      clicked.add(idx);
    }
    const button = buttons[idx];
    assert(button, "Button should exist");
    await delay(500);
    await userEvent.click(button);
  }
}

export const Default: Story = {
  async play({ canvas, userEvent }) {
    await selectRandomWords(canvas, userEvent, 5);
  },
};

const store = makeStore();
function setRoundPhase(roundId: number, phase: Enums<"round_phase">) {
  store.dispatch(
    roundApi.util.updateQueryData("getActiveRound", roundId, (round) => {
      assert(round, "Round should exist");
      round.phase = phase;
    }),
  );
}

export const Disabled: Story = {
  args: {
    gameId: 2,
  },
  async play({ canvas, userEvent }) {
    setRoundPhase(2, "submission");
    await selectRandomWords(canvas, userEvent, 3);
    await delay(500);
    setRoundPhase(2, "voting");
  },
  parameters: {
    redux: { store },
    msw: {
      handlers: {
        activeRound: http.get(tableUrl("games"), () =>
          HttpResponse.json<
            typeof roundApi.endpoints.getActiveRound.Types.RawResultType
          >({
            active_round: {
              id: 1,
              question: randSentence().replace(".", "?"),
              judge: null,
              created_at: "2024-01-01T00:00:00Z",
              phase: "submission",
            },
          }),
        ),
      },
    },
  } satisfies MswParameters & ReduxParameters,
};
