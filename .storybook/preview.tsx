import type { Decorator, Preview } from "@storybook/react-vite";
import type { Theme } from "@/features/theme/storage";
import { themeSchema, themeStore } from "@/features/theme/storage";
import "../src/styles.css";

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
};

export default preview;
