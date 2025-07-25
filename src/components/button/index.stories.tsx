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
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["elevated", "filled", "outlined", "text"],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
};

export const Text: Story = {
  args: {
    variant: "text",
  },
};

export const Outlined: Story = {
  args: {
    variant: "outlined",
  },
};

export const Filled: Story = {
  args: {
    variant: "filled",
  },
};

export const Elevated: Story = {
  args: {
    variant: "elevated",
  },
};
