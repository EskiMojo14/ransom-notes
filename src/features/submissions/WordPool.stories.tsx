import type { Meta, StoryObj } from "@storybook/react-vite";
import { assert } from "es-toolkit";
import { delay, http, HttpResponse } from "msw";
import { transformGame, type Game } from "@/features/game/api";
import { roundApi } from "@/features/round/api";
import { getStore, withSession } from "@/storybook/decorators";
import {
  mockGame,
  randIndexes,
  randRawGame,
  randWordPool,
} from "@/storybook/mocks";
import { mockSession, tableUrl } from "@/supabase/mocks";
import type { Enums } from "@/supabase/types";
import { clearSubmission } from "./slice";
import { WordPool } from "./WordPool";

const game = randRawGame();

const meta = {
  component: WordPool,
  title: "Features/Submissions/WordPool",
  parameters: {
    router: {
      currentRoute: {
        path: "/game/$inviteCode",
        params: { inviteCode: game.invite_code },
        routes: [
          {
            path: "/game/$inviteCode",
            loaderData: { game: transformGame(game) },
          },
        ],
      },
    },
    session: mockSession(),
    msw: {
      handlers: {
        wordPool: http.get(tableUrl("word_pools"), () =>
          HttpResponse.json<
            typeof roundApi.endpoints.getWordPool.Types.RawResultType
          >({
            words: randWordPool(),
          }),
        ),
        activeRound: mockGame({ game }),
      },
    },
  },
  decorators: [withSession],
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

const setRoundPhase = (gameId: Game["id"], phase: Enums<"round_phase">) =>
  roundApi.util.updateQueryData("getActiveRound", gameId, (round) => {
    assert(round, "Round should exist");
    round.phase = phase;
  });

export const Disabled = {
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
        activeRound: mockGame({ game: { id: 2 } }),
      },
    },
  },
} satisfies Story;
