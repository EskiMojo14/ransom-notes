import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Symbol } from "@/components/symbol";
import { Button } from ".";

const meta = {
  component: Button,
  title: "Components/Button",
  args: {
    children: "Edit",
    icon: <Symbol>edit</Symbol>,
    onPress: fn(),
    isDisabled: false,
    variant: "elevated",
    color: "primary",
    iconOnly: false,
    isPending: false,
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
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Disabled = {
  args: {
    isDisabled: true,
  },
} satisfies Story;

export const Text = {
  args: {
    variant: "text",
  },
} satisfies Story;

export const Outlined = {
  args: {
    variant: "outlined",
  },
} satisfies Story;

export const Filled = {
  args: {
    variant: "filled",
  },
} satisfies Story;

export const Elevated = {
  args: {
    variant: "elevated",
  },
} satisfies Story;

export const IconOnly = {
  args: {
    iconOnly: true,
  },
} satisfies Story;
