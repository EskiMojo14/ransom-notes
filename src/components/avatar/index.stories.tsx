import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from ".";

const meta = {
  component: Avatar,
  title: "Components/Avatar",
  args: {
    src: "https://avatars.githubusercontent.com/u/18308300?v=4",
    name: "EskiMojo14",
    size: "medium",
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["small", "medium", "large"],
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;

export const Default = {} satisfies StoryObj<typeof meta>;

export const NoImage = {
  args: {
    src: null,
  },
} satisfies StoryObj<typeof meta>;
