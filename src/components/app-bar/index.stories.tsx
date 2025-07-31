import type { Meta, StoryObj } from "@storybook/react-vite";
import { _LinkButton } from "@/components/button/link";
import { Symbol } from "@/components/symbol";
import { AppBar } from ".";

const meta = {
  component: AppBar,
  title: "Components/AppBar",
  parameters: { layout: "fullscreen" },
  args: {
    actions: (
      <_LinkButton
        href="/logout"
        variant="outlined"
        icon={<Symbol>logout</Symbol>}
      >
        Log out
      </_LinkButton>
    ),
  },
} satisfies Meta<typeof AppBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
