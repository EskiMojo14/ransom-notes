import type { Meta, StoryObj } from "@storybook/react-vite";
import { Symbol } from "@/components/symbol";
import { _LinkButton } from "./link";

const meta = {
  component: _LinkButton,
  title: "Components/Button/Link",
  args: {
    children: "Edit",
    icon: <Symbol>edit</Symbol>,
    href: "/",
    variant: "elevated",
    color: "primary",
    iconOnly: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["elevated", "filled", "outlined", "text"],
    },
    color: {
      control: "select",
      options: ["primary", "secondary", "error"],
    },
  },
} satisfies Meta<typeof _LinkButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
