import type { Meta, StoryObj } from "@storybook/react-vite";

const variants = [
  "headline1",
  "headline2",
  "headline3",
  "headline4",
  "headline5",
  "headline6",
  "subtitle1",
  "subtitle2",
  "body1",
  "body2",
  "overline",
  "button",
  "caption",
] as const;

const tags = {
  headline1: "h1",
  headline2: "h2",
  headline3: "h3",
  headline4: "h4",
  headline5: "h5",
  headline6: "h6",
  subtitle1: "h6",
  subtitle2: "h6",
  body1: "p",
  body2: "p",
  overline: "p",
  button: "p",
  caption: "p",
} satisfies Record<
  (typeof variants)[number],
  keyof React.JSX.IntrinsicElements
>;

const meta = {
  title: "Styles/Typography",
  render: () => (
    <>
      {variants.map((variant) => {
        const Tag = tags[variant];

        return (
          <Tag key={variant} className={variant}>
            {variant}
          </Tag>
        );
      })}
    </>
  ),
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
