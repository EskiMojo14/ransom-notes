import { randParagraph, randSentence } from "@ngneat/falso";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { delay, http, HttpResponse } from "msw";
import type { MswParameters } from "msw-storybook-addon";
import { makeStore } from "@/store";
import type { ReduxParameters } from "@/storybook/decorators";
import { withRedux } from "@/storybook/decorators";
import { tableUrl } from "@/supabase/mocks";
import type { Enums } from "@/supabase/types";
import { assert, specify } from "@/utils";
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

export const Default = {
  async play({ canvas, userEvent, step }) {
    const buttons = await canvas.findAllByRole("button");

    await step("Click 3 random buttons", async () => {
      const clicked = new Set<number>();
      while (clicked.size < 3) {
        const idx = numberUpTo(buttons.length - 1);
        if (!clicked.has(idx)) {
          clicked.add(idx);
        }
        const button = buttons[idx];
        assert(button, "Button should exist");
        await delay(500);
        await userEvent.click(button);
      }
    });
  },
} satisfies Story;

const setRoundPhase = (roundId: number, phase: Enums<"round_phase">) =>
  roundApi.util.updateQueryData("getActiveRound", roundId, (round) => {
    assert(round, "Round should exist");
    round.phase = phase;
  });

export const Disabled = {
  args: {
    gameId: 2,
  },
  async play({ context, parameters, step }) {
    specify<ReduxParameters>(parameters);
    const { store } = parameters.redux ?? {};
    assert(store, "Store should exist");

    store.dispatch(setRoundPhase(2, "submission"));

    await Default.play(context);

    await delay(500);
    await step("End submission phase", () => {
      store.dispatch(setRoundPhase(2, "voting"));
    });
  },
  parameters: {
    redux: { store: makeStore() },
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
} satisfies Story;
