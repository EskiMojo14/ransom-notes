import type { Decorator, Preview } from "@storybook/react-vite";
import { initialize, mswLoader } from "msw-storybook-addon";
import type { Theme } from "@/features/theme/storage";
import { themeSchema, themeStore } from "@/features/theme/storage";
import "../src/styles.css";

initialize();

const themeDecorator: Decorator<{ theme: Theme }> = (Story, { args }) => {
  themeStore.set(args.theme);

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
  },
  decorators: [themeDecorator as Decorator],
  argTypes: {
    theme: {
      control: {
        type: "inline-radio",
      },
      options: themeSchema.options,
    },
  },
  args: {
    theme: themeStore.get() ?? "system",
  },
  loaders: [mswLoader],
};

export default preview;
