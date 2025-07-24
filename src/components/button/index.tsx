import type { RefAttributes } from "react";
import type { ButtonProps } from "react-aria-components";
import { Button as AriaButton } from "react-aria-components";
import { bemHelper, composeClasses } from "@/utils/rac";

const cls = bemHelper("button");

export function Button({
  className,
  ...props
}: ButtonProps & RefAttributes<HTMLButtonElement>) {
  return <AriaButton {...props} className={composeClasses(cls(), className)} />;
}
