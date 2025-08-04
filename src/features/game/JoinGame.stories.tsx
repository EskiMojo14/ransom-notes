import { randRecentDate, randUserName } from "@ngneat/falso";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse } from "msw";
import type { MswParameters } from "msw-storybook-addon";
import { withRedux } from "@/storybook/decorators";
import { NotFoundError, tableUrl } from "@/supabase/mocks";
import type { Enums } from "@/supabase/types";
import type { gameApi } from "./api";
import { JoinGame } from "./JoinGame";

const mockGame = (
  request: Request,
  state: Enums<"game_state"> = "open",
): typeof gameApi.endpoints.getGameByInviteCode.Types.RawResultType => ({
  id: 1,
  invite_code:
    new URL(request.url).searchParams.get("invite_code")?.replace("eq.", "") ??
    "",
  creator_id: "1",
  creator: {
    display_name: randUserName(),
    avatar_url: null,
  },
  first_to: 10,
  state,
  voting_mode: "judge",
  created_at: randRecentDate().toISOString(),
  active_round: 1,
  participants: [],
});

const meta = {
  component: JoinGame,
  title: "Features/Game/JoinGame",
  args: {
    _useNormalLink: true,
  },
  argTypes: {
    _useNormalLink: {
      table: {
        disable: true,
      },
    },
  },
  decorators: [withRedux],
  parameters: {
    msw: {
      handlers: [
        http.get(tableUrl("games"), ({ request }) =>
          HttpResponse.json(mockGame(request)),
        ),
      ],
    },
  } satisfies MswParameters,
} satisfies Meta<typeof JoinGame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Open = {
  args: {
    inviteCode: "OPEN",
  },
} satisfies Story;

export const Running = {
  args: {
    inviteCode: "RUNNING",
  },
  parameters: {
    msw: {
      handlers: [
        http.get(tableUrl("games"), ({ request }) =>
          HttpResponse.json(mockGame(request, "running")),
        ),
      ],
    },
  } satisfies MswParameters,
} satisfies Story;

export const Finished = {
  args: {
    inviteCode: "FINISHED",
  },
  parameters: {
    msw: {
      handlers: [
        http.get(tableUrl("games"), ({ request }) =>
          HttpResponse.json(mockGame(request, "finished")),
        ),
      ],
    },
  } satisfies MswParameters,
} satisfies Story;

export const NotFound = {
  args: {
    inviteCode: "NOT FOUND",
  },
  parameters: {
    msw: {
      handlers: [
        http.get(tableUrl("games"), () =>
          HttpResponse.json(NotFoundError, { status: 406 }),
        ),
      ],
    },
  } satisfies MswParameters,
} satisfies Story;
