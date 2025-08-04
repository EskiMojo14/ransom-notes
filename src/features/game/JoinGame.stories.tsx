import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse } from "msw";
import { randRawGame } from "@/storybook/mocks";
import { NotFoundError, tableUrl } from "@/supabase/mocks";
import type { Enums } from "@/supabase/types";
import { JoinGame } from "./JoinGame";

const mockGame = (request: Request, state: Enums<"game_state"> = "open") =>
  randRawGame({
    invite_code:
      new URL(request.url).searchParams
        .get("invite_code")
        ?.replace("eq.", "") ?? "",
    state,
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
  parameters: {
    msw: {
      handlers: [
        http.get(tableUrl("games"), ({ request }) =>
          HttpResponse.json(mockGame(request)),
        ),
      ],
    },
  },
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
  },
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
  },
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
  },
} satisfies Story;
