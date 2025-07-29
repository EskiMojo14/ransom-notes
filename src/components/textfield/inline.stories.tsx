import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Symbol } from "@/components/symbol";
import { InlineTextField } from ".";

const meta = {
  component: InlineTextField,
  title: "Components/InlineTextField",
  args: {
    label: "Invite code",
    description: "Code to access game",
    errorMessage: "Game has already started",
    placeholder: "Enter code",
    onChange: fn(),
    isDisabled: false,
    isInvalid: false,
    defaultValue: "FOO",
    icon: <Symbol>password_2</Symbol>,
  },
} satisfies Meta<typeof InlineTextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
