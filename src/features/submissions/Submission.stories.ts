import type { Meta, StoryObj } from "@storybook/react-vite";
import { Submission } from "./Submission";

const meta = {
  component: Submission,
  title: "Features/Submissions/Submission",
  args: {
    rows: ["I have elaborate booty chaos", "please not mad"],
  },
} satisfies Meta<typeof Submission>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
