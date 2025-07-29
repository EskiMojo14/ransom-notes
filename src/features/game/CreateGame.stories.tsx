import type { Meta, StoryObj } from "@storybook/react-vite";
import { CreateGame } from "./CreateGame";

const meta = {
  component: CreateGame,
  title: "Features/Game/CreateGame",
} satisfies Meta<typeof CreateGame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
