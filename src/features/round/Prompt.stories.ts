import type { Meta, StoryObj } from "@storybook/react-vite";
import { transformGame } from "@/features/game/api";
import { mockGame, randRawGame } from "@/storybook/mocks";
import { Prompt } from "./Prompt";

const game = randRawGame();

const meta = {
  component: Prompt,
  title: "Features/Round/Prompt",
  parameters: {
    router: {
      currentRoute: {
        path: "/game/$inviteCode",
        params: { inviteCode: game.invite_code },
        routes: [
          {
            path: "/game/$inviteCode",
            loaderData: { game: transformGame(game) },
          },
        ],
      },
    },
    msw: {
      handlers: [mockGame({ game })],
    },
  },
} satisfies Meta<typeof Prompt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
