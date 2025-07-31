import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/button";
import { Dialog } from "./index";

const meta = {
  component: Dialog,
  title: "Components/Dialog",
  args: {
    trigger: <Button>Open</Button>,
    title: "Title",
    children: "Content",
    actions: (
      <>
        <Button slot="close" variant="outlined">
          Close
        </Button>
        <Button variant="filled">Save</Button>
      </>
    ),
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
