import { clsx } from "clsx";
import type { StyleRenderProps } from "react-aria-components";
import type { HelperArguments } from "react-bem-helper";
import BEMHelper from "react-bem-helper";

type ClassNameOrFunction<T> = StyleRenderProps<T>["className"];
type ClassFunction<T> = Extract<
  ClassNameOrFunction<T>,
  (...args: never) => unknown
>;

export function bemHelper(
  name: string,
): <T>(
  args:
    | HelperArguments
    | ((values: T & { defaultClassName?: string }) => HelperArguments),
  extra?: ClassNameOrFunction<T>,
) => ClassFunction<T> {
  const baseHelper = new BEMHelper({ name, outputIsString: true });
  return (arg, extra) => (values) => {
    const args = typeof arg === "function" ? arg(values) : arg;
    const extraClassName = typeof extra === "function" ? extra(values) : extra;
    return baseHelper({
      ...args,
      extra: clsx(args.extra, extraClassName),
    });
  };
}
