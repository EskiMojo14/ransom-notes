import type { Decorator, Preview } from "@storybook/react-vite";
import { initialize, mswLoader } from "msw-storybook-addon";
import { env } from "@/env";
import type { Theme } from "@/features/theme/storage";
import { themeSchema, themeStore } from "@/features/theme/storage";
import "@/styles.css";

initialize({
  onUnhandledRequest(request, print) {
    if (request.url.startsWith(env.VITE_SUPABASE_URL)) {
      print.error();
      throw new Error("Unhandled request: " + request.url);
    }
    if (
      !(
        request.url.includes("/src/") ||
        request.url.includes("/assets/") ||
        request.url.startsWith("https://fonts.googleapis.com")
      )
    ) {
      print.warning();
    }
  },
});

const themeDecorator: Decorator<{ theme: Theme }> = (Story, { args }) => {
  themeStore.set(args.theme);

  return <Story />;
};

const rtlDecorator: Decorator<{ dir: "ltr" | "rtl" }> = (Story, { args }) => {
  document.documentElement.dir = args.dir;

  return <Story />;
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "centered",
  },
  decorators: [themeDecorator as Decorator, rtlDecorator as Decorator],
  argTypes: {
    theme: {
      control: {
        type: "inline-radio",
      },
      options: themeSchema.options,
    },
    dir: {
      control: {
        type: "inline-radio",
      },
      options: ["ltr", "rtl"],
    },
  },
  args: {
    theme: themeStore.get() ?? "system",
    dir: "ltr",
  },
  loaders: [mswLoader],
};

export default preview;
