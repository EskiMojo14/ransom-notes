import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse } from "msw";
import type { MswParameters } from "msw-storybook-addon";
import type { SessionParameters } from "@/storybook/decorators";
import { withRedux, withSession } from "@/storybook/decorators";
import { mockSession, tableUrl } from "@/supabase/mocks";
import type { gameApi } from "./api";
import { CreateGame } from "./CreateGame";

const meta = {
  component: CreateGame,
  title: "Features/Game/CreateGame",
  decorators: [withRedux, withSession],
  parameters: {
    session: mockSession(),
    msw: {
      handlers: [
        http.post(tableUrl("games"), () =>
          HttpResponse.json<
            typeof gameApi.endpoints.createGame.Types.RawResultType
          >({ invite_code: "1234", id: 1 }),
        ),
      ],
    },
  } satisfies MswParameters & SessionParameters,
} satisfies Meta<typeof CreateGame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
