import type { Meta, StoryObj } from "@storybook/react-vite";
import { words } from "./constants";
import { Words } from "./Words";

const meta = {
  component: Words,
  title: "Features/Words/Words",
  args: {
    words: words.slice(0, 10),
  },
} satisfies Meta<typeof Words>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
