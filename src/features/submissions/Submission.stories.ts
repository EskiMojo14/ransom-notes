import { randTextRange, randUserName } from "@ngneat/falso";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse } from "msw";
import type { MswParameters } from "msw-storybook-addon";
import { withRedux } from "@/storybook/decorators";
import { tableUrl } from "@/supabase/mocks";
import type { submissionApi } from "./api";
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
        http.get(tableUrl("submissions"), () =>
          HttpResponse.json<
            typeof submissionApi.endpoints.getSubmissions.Types.RawResultType
          >([
            {
              rows: randTextRange({ min: 20, max: 25, length: 3 }).map(
                (sentence) =>
                  sentence.replace(/[^a-zA-Z\s]/g, "").toLowerCase(),
              ),
              created_at: "2024-01-01T00:00:00Z",
              user_id: "1",
              author: {
                display_name: randUserName(),
              },
            },
          ]),
        ),
      ],
    },
  } satisfies MswParameters,
  decorators: [withRedux],
} satisfies Meta<typeof Submission>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
