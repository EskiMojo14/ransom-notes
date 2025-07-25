import { randParagraph, randSentence } from "@ngneat/falso";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse } from "msw";
import type { MswParameters } from "msw-storybook-addon";
import { withRedux } from "@/storybook/decorators";
import { tableUrl } from "@/supabase/mocks";
import type { roundApi } from "../round/api";
import { WordToggleButtonGroup } from "./WordButton";

const meta = {
  component: WordToggleButtonGroup,
  title: "Features/Submissions/WordToggleButtonGroup",
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
} satisfies Meta<typeof WordToggleButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    gameId: 2,
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
              question: randSentence().replace(".", "?"),
              judge: null,
              created_at: "2024-01-01T00:00:00Z",
              phase: "voting",
            },
          }),
        ),
      },
    },
  } satisfies MswParameters,
};
