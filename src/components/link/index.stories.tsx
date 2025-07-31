import type { Meta, StoryObj } from "@storybook/react-vite";
import { _Link } from ".";

const meta = {
  component: _Link,
  title: "Components/Link",
  args: {
    children: "Home",
    href: "/",
  },
} satisfies Meta<typeof _Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
