import { randUserName } from "@ngneat/falso";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse } from "msw";
import type { MswParameters } from "msw-storybook-addon";
import type { submissionApi } from "@/features/submissions/api";
import { Route } from "@/routes/game/$inviteCode";
import type { SessionParameters } from "@/storybook/decorators";
import { withRedux, withSession } from "@/storybook/decorators";
import { mockGame, mockRoute, randSubmission } from "@/storybook/mocks";
import { mockSession, tableUrl } from "@/supabase/mocks";
import type { profileApi } from "../profile/api";
import type { voteApi } from "./api";
import { Submissions } from "./Submissions";

mockRoute(Route).params({ inviteCode: "FOO" });

const session = mockSession();

const meta = {
  component: Submissions,
  title: "Features/Votes/Submissions",
  decorators: [withRedux, withSession],
  parameters: {
    session,
    msw: {
      handlers: {
        game: mockGame({
          round: {
            judge_id: session.user.id,
            phase: "voting",
          },
        }),
        votes: [
          http.get(tableUrl("votes"), () =>
            HttpResponse.json<
              typeof voteApi.endpoints.getVotes.Types.RawResultType
            >([]),
          ),
          http.post<
            {},
            typeof voteApi.endpoints.upsertVote.Types.QueryArg,
            typeof voteApi.endpoints.upsertVote.Types.RawResultType
          >(tableUrl("votes"), async ({ request }) =>
            HttpResponse.json({
              ...(await request.json()),
              user: {
                display_name: session.user.user_metadata.user_name,
              },
            }),
          ),
        ],
        profile: http.get(tableUrl("profiles"), () =>
          HttpResponse.json<
            typeof profileApi.endpoints.getProfile.Types.RawResultType
          >({
            display_name: session.user.user_metadata.user_name,
            avatar_url: null,
          }),
        ),
        submissions: http.get(tableUrl("submissions"), () =>
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
            {
              rows: randSubmission(),
              user_id: "2",
              author: {
                display_name: randUserName(),
              },
            },
          ]),
        ),
      },
    },
  } satisfies MswParameters & SessionParameters,
} satisfies Meta<typeof Submissions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AsJudge = {} satisfies Story;

export const NotJudge = {
  parameters: {
    msw: {
      handlers: {
        game: mockGame(),
      },
    },
  } satisfies MswParameters,
} satisfies Story;
