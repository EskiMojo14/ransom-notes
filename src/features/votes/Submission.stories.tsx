import { randUserName } from "@ngneat/falso";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse } from "msw";
import type { MswParameters } from "msw-storybook-addon";
import type { ComponentProps } from "react";
import { ToggleButtonGroup } from "react-aria-components";
import { fn } from "storybook/test";
import type { submissionApi } from "@/features/submissions/api";
import { withRedux } from "@/storybook/decorators";
import { randSubmission } from "@/storybook/mocks";
import { tableUrl } from "@/supabase/mocks";
import { Submission } from "./Submission";

const meta = {
  component: Submission,
  title: "Features/Votes/Submission",
  args: {
    roundId: 1,
    authorId: "1",
    onSelectionChange: fn(),
  },
  render: ({ onSelectionChange, ...args }) => (
    <ToggleButtonGroup
      selectionMode="single"
      onSelectionChange={onSelectionChange}
    >
      <Submission {...args} />
    </ToggleButtonGroup>
  ),
  parameters: {
    msw: {
      handlers: [
        http.get(tableUrl("submissions"), () =>
          HttpResponse.json<
            typeof submissionApi.endpoints.getSubmissions.Types.RawResultType
          >([
            {
              rows: randSubmission(),
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
} satisfies Meta<
  ComponentProps<typeof Submission> & { onSelectionChange: () => void }
>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
