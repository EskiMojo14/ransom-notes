import { clsx } from "clsx";
import type { StyleRenderProps } from "react-aria-components";
import BEMHelper from "react-bem-helper";

export const bemHelper = BEMHelper.withDefaults({
  outputIsString: true,
});

type ClassNameOrFunction<T> = StyleRenderProps<T>["className"];
type ClassFunction<T> = Extract<
  ClassNameOrFunction<T>,
  (...args: never) => unknown
>;

export const composeClasses =
  <T>(...classes: Array<ClassNameOrFunction<T>>): ClassFunction<T> =>
  (values) =>
    clsx(classes.map((c) => (typeof c === "function" ? c(values) : c)));
