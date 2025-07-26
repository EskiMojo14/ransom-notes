import { clsx } from "clsx";
import type { RenderProps } from "react-aria-components";
import BEMHelper from "react-bem-helper";

export const bemHelper = BEMHelper.withDefaults({
  outputIsString: true,
});

type ClassNameOrFunction<T> = RenderProps<T>["className"];
type ClassFunction<T> = Extract<
  ClassNameOrFunction<T>,
  (...args: never) => unknown
>;

export const composeClasses =
  <T>(...classes: Array<ClassNameOrFunction<T>>): ClassFunction<T> =>
  (values) =>
    clsx(classes.map((c) => (typeof c === "function" ? c(values) : c)));
