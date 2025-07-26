import type { ReactNode, RefAttributes } from "react";
import type { ButtonProps as AriaButtonProps } from "react-aria-components";
import { Button as AriaButton } from "react-aria-components";
import { bemHelper, composeClasses, renderChildren } from "@/utils/rac";

const cls = bemHelper("button");

interface ButtonProps extends AriaButtonProps {
  icon?: ReactNode;
  variant?: "elevated" | "filled" | "outlined" | "text";
  color?: "primary" | "secondary" | "error";
  iconOnly?: boolean;
}

export function Button({
  className,
  icon,
  children,
  variant = "text",
  color = "primary",
  iconOnly = false,
  ...props
}: ButtonProps & RefAttributes<HTMLButtonElement>) {
  return (
    <AriaButton
      {...props}
      className={composeClasses(
        cls({
          modifiers: {
            [variant]: true,
            [color]: true,
            icon: iconOnly,
          },
        }),
        className,
      )}
    >
      {renderChildren(children, (children) => (
        <>
          {!!icon && <span className={cls("icon")}>{icon}</span>}
          {iconOnly ? <span className="sr-only">{children}</span> : children}
        </>
      ))}
    </AriaButton>
  );
}
