import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse } from "msw";
import type { MswParameters } from "msw-storybook-addon";
import { env } from "@/env";
import { withRedux } from "@/storybook/decorators";
import { questions } from "./constants";
import { Prompt } from "./Prompt";

const meta = {
  component: Prompt,
  title: "Features/Questions/Prompt",
  args: {
    gameId: 1,
  },
  decorators: [withRedux()],
  parameters: {
    msw: {
      handlers: [
        http.get(env.VITE_SUPABASE_URL + "/rest/v1/games", () => {
          return HttpResponse.json({
            active_round: {
              question: questions[0],
            },
          });
        }),
      ],
    },
  } satisfies MswParameters,
} satisfies Meta<typeof Prompt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
