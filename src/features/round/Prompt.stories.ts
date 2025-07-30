import type { Meta, StoryObj } from "@storybook/react-vite";
import type { MswParameters } from "msw-storybook-addon";
import { withRedux } from "@/storybook/decorators";
import { mockGame } from "@/storybook/mocks";
import { Prompt } from "./Prompt";

const meta = {
  component: Prompt,
  title: "Features/Round/Prompt",
  decorators: [withRedux],
  parameters: {
    msw: {
      handlers: [mockGame()],
    },
  } satisfies MswParameters,
} satisfies Meta<typeof Prompt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
