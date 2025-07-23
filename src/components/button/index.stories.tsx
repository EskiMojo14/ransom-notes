import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Symbol } from "../symbol";
import { Button } from ".";

const meta = {
  component: Button,
  title: "Components/Button",
  args: {
    children: (
      <>
        <Symbol>edit</Symbol>
        Edit
      </>
    ),
    onPress: fn(),
    isDisabled: false,
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
