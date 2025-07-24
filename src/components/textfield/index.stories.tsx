import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Symbol } from "@/components/symbol";
import { TextField } from ".";

const meta = {
  component: TextField,
  title: "Components/TextField",
  args: {
    label: "Invite code",
    description: "Code to access game",
    errorMessage: "Game has already started",
    placeholder: "Enter code",
    onChange: fn(),
    isDisabled: false,
    isInvalid: false,
    multiline: false,
    value: "FOO",
    icon: <Symbol>password_2</Symbol>,
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
};

export const Invalid: Story = {
  args: {
    isInvalid: true,
  },
};

export const Multiline: Story = {
  args: {
    multiline: true,
  },
};
