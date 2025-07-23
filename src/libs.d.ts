declare module "postcss-extend-rule" {
  import type { Plugin } from "postcss";
  type OnSyntax = "remove" | "ignore" | "warn" | "throw";
  interface Config {
    name?: string;
    onFunctionalSelector?: OnSyntax;
    onRecursiveExtend?: OnSyntax;
    onUnusedExtend?: OnSyntax;
  }
  export default function postcssExtendRule(config?: Config): Plugin;
}

declare module "csstype" {
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  export interface CSSProperties {
    [variable: `--${string}`]: string;
  }
}
