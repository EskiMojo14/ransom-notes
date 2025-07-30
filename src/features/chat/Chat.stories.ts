import { randRecentDate, randSentence, randUserName } from "@ngneat/falso";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { delay, http, HttpResponse } from "msw";
import type { MswParameters } from "msw-storybook-addon";
import type { userApi } from "@/features/auth/api";
import type { SessionParameters } from "@/storybook/decorators";
import { withRedux, withSession } from "@/storybook/decorators";
import { mockGame } from "@/storybook/mocks";
import { mockSession, tableUrl } from "@/supabase/mocks";
import { getHandlers } from "@/supabase/realtime";
import type { TablesInsert } from "@/supabase/types";
import type { chatApi } from "./api";
import { Chat } from "./Chat";

const session = mockSession();

const names = {
  1: session.user.user_metadata.user_name,
  2: randUserName(),
};

let id = 3;

const meta = {
  component: Chat,
  title: "Features/Chat/Chat",
  async play() {
    await delay(2000);
    const handlers = getHandlers("messages");
    handlers.insert({
      old: {},
      new: {
        id: id++,
        created_at: new Date().toISOString(),
        message: randSentence(),
        user_id: "2",
        game_id: 1,
      },
    });
    await delay(2000);
    handlers.insert({
      old: {},
      new: {
        id: id++,
        created_at: new Date(Date.now() + 1000 * 60 * 5).toISOString(),
        message: randSentence(),
        user_id: "2",
        game_id: 1,
      },
    });
  },
  decorators: [withRedux, withSession],
  parameters: {
    session,
    msw: {
      handlers: [
        mockGame(),
        http.get(tableUrl("profiles"), ({ request }) =>
          HttpResponse.json<
            typeof userApi.endpoints.getProfile.Types.RawResultType
          >({
            display_name:
              names[
                (new URL(request.url).searchParams
                  .get("id")
                  ?.replace("eq.", "") ?? "1") as unknown as keyof typeof names
              ],
            avatar_url: null,
          }),
        ),
        http.get(tableUrl("messages"), () =>
          HttpResponse.json<
            typeof chatApi.endpoints.getChatMessages.Types.RawResultType
          >([
            {
              id: 1,
              created_at: randRecentDate().toISOString(),
              message: randSentence(),
              user_id: session.user.id,
              author: {
                display_name: session.user.user_metadata.user_name,
              },
            },
            {
              id: 2,
              created_at: new Date().toISOString(),
              message: randSentence(),
              user_id: "2",
              author: {
                display_name: names[2],
              },
            },
          ]),
        ),
        http.post<{}, TablesInsert<"messages">>(
          tableUrl("messages"),
          async ({ request }) =>
            HttpResponse.json<
              typeof chatApi.endpoints.sendChatMessage.Types.RawResultType
            >({
              id: id++,
              created_at: new Date().toISOString(),
              author: {
                display_name: session.user.user_metadata.user_name,
              },
              ...(await request.json()),
            }),
        ),
      ],
    },
  } satisfies MswParameters & SessionParameters,
} satisfies Meta<typeof Chat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
