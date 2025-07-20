import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse } from "msw";
import type { MswParameters } from "msw-storybook-addon";
import { env } from "@/env";
import { withRedux } from "@/storybook/decorators";
import { words } from "./constants";
import { Words } from "./Words";

function shuffle<T>(array: Array<T>) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      array[randomIndex]!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      array[currentIndex]!,
    ];
  }
  return array;
}

const meta = {
  component: Words,
  title: "Features/Words/Words",
  args: {
    gameId: 1,
    userId: "1",
  },
  parameters: {
    msw: {
      handlers: [
        http.get(env.VITE_SUPABASE_URL + "/rest/v1/word_pools", () => {
          return HttpResponse.json({
            words: shuffle(words.slice(0, 15)),
          });
        }),
      ],
    },
  } satisfies MswParameters,
  decorators: [withRedux()],
} satisfies Meta<typeof Words>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
