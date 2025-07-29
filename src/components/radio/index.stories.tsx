import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Radio, RadioGroup, TwoLineRadioLabel } from ".";

const meta = {
  component: RadioGroup,
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="judge">
        <TwoLineRadioLabel
          label="Judge"
          description="Winner is decided by a single player"
        />
      </Radio>
      <Radio value="jury">
        <TwoLineRadioLabel
          label="Jury"
          description="Winner is decided by the most votes (judge becomes tiebreaker)"
        />
      </Radio>
    </RadioGroup>
  ),
  title: "Components/RadioGroup",
  args: {
    defaultValue: "judge",
    name: "voting_mode",
    onChange: fn(),
    isDisabled: false,
    isInvalid: false,
    label: "Voting mode",
    description: "How players vote",
    errorMessage: "Please select a voting mode",
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Disabled = {
  args: {
    isDisabled: true,
  },
} satisfies Story;

export const Invalid = {
  args: {
    isInvalid: true,
  },
} satisfies Story;
