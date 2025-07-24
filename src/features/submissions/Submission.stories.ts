import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse } from "msw";
import type { MswParameters } from "msw-storybook-addon";
import { env } from "@/env";
import { withRedux } from "@/storybook/decorators";
import type { MockFor } from "@/supabase/api";
import type { submissionQueries } from "./api";
import { Submission } from "./Submission";

const meta = {
  component: Submission,
  title: "Features/Submissions/Submission",
  args: {
    roundId: 1,
    authorId: "1",
    showAuthor: true,
  },
  parameters: {
    msw: {
      handlers: [
        http.get(env.VITE_SUPABASE_URL + "/rest/v1/submissions", () =>
          HttpResponse.json<MockFor<typeof submissionQueries.getSubmissions>>([
            {
              rows: ["I have elaborate booty chaos", "please not mad"],
              created_at: "2024-01-01T00:00:00Z",
              user_id: "1",
              author: {
                display_name: "John Doe",
              },
            },
          ]),
        ),
      ],
    },
  } satisfies MswParameters,
  decorators: [withRedux()],
} satisfies Meta<typeof Submission>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
