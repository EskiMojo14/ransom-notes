import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse } from "msw";
import type { MswParameters } from "msw-storybook-addon";
import { env } from "@/env";
import { withRedux } from "@/storybook/decorators";
import { WordToggleButton } from "./WordButton";

const meta = {
  component: WordToggleButton,
  title: "Features/Submissions/WordToggleButton",
  args: {
    wordIndex: 0,
    gameId: 1,
    roundId: 1,
    userId: "1",
  },
  parameters: {
    msw: {
      handlers: [
        http.get(env.VITE_SUPABASE_URL + "/rest/v1/word_pools", () =>
          HttpResponse.json({
            words: ["nice"],
          }),
        ),
      ],
    },
  } satisfies MswParameters,
  decorators: [withRedux()],
} satisfies Meta<typeof WordToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
