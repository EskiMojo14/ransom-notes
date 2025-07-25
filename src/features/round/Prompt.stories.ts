import { randSentence } from "@ngneat/falso";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse } from "msw";
import type { MswParameters } from "msw-storybook-addon";
import { withRedux } from "@/storybook/decorators";
import { tableUrl } from "@/supabase/mocks";
import type { roundApi } from "./api";
import { Prompt } from "./Prompt";

const meta = {
  component: Prompt,
  title: "Features/Questions/Prompt",
  args: {
    gameId: 1,
  },
  decorators: [withRedux],
  parameters: {
    msw: {
      handlers: [
        http.get(tableUrl("games"), () => {
          return HttpResponse.json<
            typeof roundApi.endpoints.getActiveRound.Types.RawResultType
          >({
            active_round: {
              id: 1,
              question: randSentence().replace(".", "?"),
              judge: null,
              created_at: "2024-01-01T00:00:00Z",
              phase: "submission",
            },
          });
        }),
      ],
    },
  } satisfies MswParameters,
} satisfies Meta<typeof Prompt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
