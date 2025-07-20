import type { Meta, StoryObj } from "@storybook/react-vite";
import { questions } from "./constants";
import { Prompt } from "./Prompt";

const meta = {
  component: Prompt,
  title: "Features/Questions/Prompt",
  args: {
    children: questions[0],
  },
} satisfies Meta<typeof Prompt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
