import type { RefAttributes } from "react";
import type { ButtonProps } from "react-aria-components";
import { Button as AriaButton } from "react-aria-components";
import { bemHelper, composeClasses } from "../../utils/rac";

const classes = bemHelper("button");

export function Button({
  className,
  ...props
}: ButtonProps & RefAttributes<HTMLButtonElement>) {
  return (
    <AriaButton {...props} className={composeClasses(classes(), className)} />
  );
}
