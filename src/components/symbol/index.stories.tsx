import type { Meta, StoryObj } from "@storybook/react-vite";
import { Symbol } from ".";

const meta = {
  component: Symbol,
  title: "Components/Symbol",
  args: {
    children: "edit",
    fill: false,
    weight: 400,
    grade: 0,
    opticalSize: undefined,
    size: 24,
    flipRtl: false,
  },
  argTypes: {
    opticalSize: {
      control: "range",
      min: 20,
      max: 48,
    },
  },
} satisfies Meta<typeof Symbol>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
