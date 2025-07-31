import type { Meta, StoryObj } from "@storybook/react-vite";
import { http, HttpResponse } from "msw";
import type { MswParameters } from "msw-storybook-addon";
import {
  withRedux,
  withSession,
  type SessionParameters,
} from "@/storybook/decorators";
import { mockSession, tableUrl } from "@/supabase/mocks";
import type { TablesInsert } from "@/supabase/types";
import type { profileApi } from "./api";
import { ProfileDialog } from "./ProfileDialog";

const session = mockSession({
  user_metadata: {
    user_name: "EskiMojo14",
  },
});

const meta = {
  component: ProfileDialog,
  title: "Features/Profile/ProfileDialog",
  decorators: [withRedux, withSession],
  parameters: {
    session,
    msw: {
      handlers: [
        http.get(tableUrl("profiles"), () =>
          HttpResponse.json<
            typeof profileApi.endpoints.getProfile.Types.RawResultType
          >({
            display_name: session.user.user_metadata.user_name,
            avatar_url: null,
          }),
        ),
        http.patch<
          {},
          TablesInsert<"profiles">,
          typeof profileApi.endpoints.updateProfile.Types.RawResultType
        >(tableUrl("profiles"), async ({ request }) => {
          const body = await request.json();
          return HttpResponse.json({
            display_name:
              body.display_name ?? session.user.user_metadata.user_name,
            avatar_url: body.avatar_url ?? null,
          });
        }),
      ],
    },
  } satisfies SessionParameters & MswParameters,
} satisfies Meta<typeof ProfileDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
