import { randParagraph } from "@ngneat/falso";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse } from "msw";
import type { MswParameters } from "msw-storybook-addon";
import { env } from "@/env";
import { withRedux } from "@/storybook/decorators";
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
      handlers: [
        http.get(env.VITE_SUPABASE_URL + "/rest/v1/word_pools", () =>
          HttpResponse.json<
            typeof roundApi.endpoints.getWordPool.Types.RawResultType
          >({
            words: randParagraph()
              .replace(/[^a-zA-Z\s]/g, "")
              .toLowerCase()
              .split(" "),
          }),
        ),
      ],
    },
  } satisfies MswParameters,
  decorators: [withRedux()],
} satisfies Meta<typeof WordToggleButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
