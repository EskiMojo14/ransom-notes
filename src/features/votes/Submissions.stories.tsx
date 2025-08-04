import { randUserName } from "@ngneat/falso";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse } from "msw";
import { transformGame } from "@/features/game/api";
import type { profileApi } from "@/features/profile/api";
import type { submissionApi } from "@/features/submissions/api";
import { withSession } from "@/storybook/decorators";
import { mockGame, randRawGame, randSubmission } from "@/storybook/mocks";
import { mockSession, tableUrl } from "@/supabase/mocks";
import type { voteApi } from "./api";
import { Submissions } from "./Submissions";

const game = randRawGame();
const session = mockSession();

const meta = {
  component: Submissions,
  title: "Features/Votes/Submissions",
  decorators: [withSession],
  parameters: {
    router: {
      currentRoute: {
        path: "/game/$inviteCode",
        params: { inviteCode: game.invite_code },
        routes: [
          { path: "/game" },
          { path: "/$inviteCode", loaderData: { game: transformGame(game) } },
        ],
      },
    },
    session,
    msw: {
      handlers: {
        game: mockGame({
          game,
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
  },
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
  },
} satisfies Story;
