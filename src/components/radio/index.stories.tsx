import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup } from "react-aria-components";
import { fn } from "storybook/test";
import { Radio } from ".";

const meta = {
  component: Radio,
  render: (args) => (
    <RadioGroup defaultValue="option1">
      <Radio {...args}>Option 1</Radio>
      <Radio value="option2">Option 2</Radio>
      <Radio value="option3">Option 3</Radio>
    </RadioGroup>
  ),
  title: "Components/Radio",
  args: {
    value: "option1",
    onPress: fn(),
    isDisabled: false,
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Disabled = {
  args: {
    isDisabled: true,
  },
} satisfies Story;
