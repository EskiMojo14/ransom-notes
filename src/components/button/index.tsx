import type { ReactNode, RefAttributes } from "react";
import type { ButtonProps as AriaButtonProps } from "react-aria-components";
import { Button as AriaButton } from "react-aria-components";
import { bemHelper, composeClasses, renderChildren } from "@/utils/rac";

const cls = bemHelper("button");

interface ButtonProps extends AriaButtonProps {
  icon?: ReactNode;
  variant?: "elevated" | "filled" | "outlined" | "text";
}

export function Button({
  className,
  icon,
  children,
  variant = "elevated",
  ...props
}: ButtonProps & RefAttributes<HTMLButtonElement>) {
  return (
    <AriaButton
      {...props}
      className={composeClasses(cls({ modifier: variant }), className)}
    >
      {renderChildren(children, (children) => (
        <>
          {!!icon && <span className={cls("icon")}>{icon}</span>}
          {children}
        </>
      ))}
    </AriaButton>
  );
}
