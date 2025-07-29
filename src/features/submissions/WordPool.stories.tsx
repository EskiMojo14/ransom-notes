import { randRecentDate } from "@ngneat/falso";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { assert } from "es-toolkit";
import { delay, http, HttpResponse } from "msw";
import type { MswParameters } from "msw-storybook-addon";
import { getStore, withRedux } from "@/storybook/decorators";
import { randIndexes, randQuestion, randWordPool } from "@/storybook/mocks";
import { tableUrl } from "@/supabase/mocks";
import type { Enums } from "@/supabase/types";
import { roundApi } from "@/features/round/api";
import { clearSubmission } from "./slice";
import { WordPool } from "./WordPool";

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
            words: randWordPool(),
          }),
        ),
        activeRound: http.get(tableUrl("games"), () =>
          HttpResponse.json<
            typeof roundApi.endpoints.getActiveRound.Types.RawResultType
          >({
            active_round: {
              id: 1,
              prompt: { prompt: randQuestion() },
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
} satisfies Meta<typeof WordPool>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  async play({ canvas, userEvent, step, parameters }) {
    const store = getStore(parameters);

    store.dispatch(clearSubmission());

    const buttons = await canvas.findAllByRole("button");

    await step("Click 3 random buttons", async () => {
      for (const idx of randIndexes(buttons.length, 3)) {
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
    const store = getStore(parameters);

    store.dispatch(setRoundPhase(2, "submission"));

    await Default.play(context);

    await delay(500);
    await step("End submission phase", () => {
      store.dispatch(setRoundPhase(2, "voting"));
    });
  },
  parameters: {
    msw: {
      handlers: {
        activeRound: http.get(tableUrl("games"), () =>
          HttpResponse.json<
            typeof roundApi.endpoints.getActiveRound.Types.RawResultType
          >({
            active_round: {
              id: 1,
              prompt: { prompt: randQuestion() },
              judge: null,
              created_at: randRecentDate().toISOString(),
              phase: "submission",
            },
          }),
        ),
      },
    },
  } satisfies MswParameters,
} satisfies Story;
