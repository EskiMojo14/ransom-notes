import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse } from "msw";
import type { MswParameters } from "msw-storybook-addon";
import { env } from "@/env";
import { withRedux } from "@/storybook/decorators";
import { PackPicker } from "./PackPicker";

const meta = {
  component: PackPicker,
  title: "Features/Packs/PackPicker",
  decorators: [withRedux()],
  parameters: {
    msw: {
      handlers: [
        http.get(env.VITE_SUPABASE_URL + "/rest/v1/packs", () => {
          return HttpResponse.json(
            ["en", "fr", "es"].map((lang) => ({ lang })),
          );
        }),
      ],
    },
  } satisfies MswParameters,
} satisfies Meta<typeof PackPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
