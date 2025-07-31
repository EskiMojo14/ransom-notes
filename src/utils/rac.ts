import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import type { ReactNode } from "react";
import BEMHelper from "react-bem-helper";

export const bemHelper = BEMHelper.withDefaults({
  outputIsString: true,
});

export type ClassNameOrFunction<T> =
  | string
  | ((props: T & { defaultClassName?: string }) => ClassValue);
export type ChildrenOrFunction<T> = ReactNode | ((props: T) => ReactNode);

type ClassFunction<T> = (props: T) => ClassValue;
type ClassValueOrFunction<T> = ClassValue | ClassFunction<T>;

const isClassFunction = <T>(
  value: ClassValueOrFunction<T>,
): value is ClassFunction<T> => typeof value === "function";

export const composeClasses =
  <T>(...classes: Array<ClassValueOrFunction<T>>) =>
  (values: T) =>
    clsx(classes.map((c) => (isClassFunction(c) ? c(values) : c)));
