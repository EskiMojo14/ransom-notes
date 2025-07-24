import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse } from "msw";
import type { MswParameters } from "msw-storybook-addon";
import { env } from "@/env";
import { withRedux } from "@/storybook/decorators";
import type { MockFor } from "@/supabase/api";
import type { roundQueries } from "./api";
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
          return HttpResponse.json<MockFor<typeof roundQueries.getActiveRound>>(
            {
              active_round: {
                id: 1,
                question:
                  "Tell someone you've clogged their toilet during a party",
                judge: null,
                created_at: "2024-01-01T00:00:00Z",
              },
            },
          );
        }),
      ],
    },
  } satisfies MswParameters,
} satisfies Meta<typeof Prompt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
