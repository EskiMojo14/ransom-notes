import { CircularProgress } from "@rmwc/circular-progress";
import "@rmwc/circular-progress/styles";
import type { RefAttributes } from "react";
import type { ButtonProps as AriaButtonProps } from "react-aria-components";
import {
  Button as AriaButton,
  composeRenderProps,
} from "react-aria-components";
import { bemHelper, composeClasses } from "@/utils/rac";

const cls = bemHelper("button");

interface ButtonProps extends AriaButtonProps {
  icon?: AriaButtonProps["children"];
  variant?: "elevated" | "filled" | "outlined" | "text";
  color?: "primary" | "secondary" | "error";
  iconOnly?: boolean;
  replaceIconWhenPending?: boolean;
}

export function Button({
  className,
  icon,
  children,
  variant = "text",
  color = "primary",
  iconOnly = false,
  replaceIconWhenPending = true,
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
      {composeRenderProps(children, (children, renderProps) => {
        return (
          <>
            {composeRenderProps(
              icon,
              (icon, { defaultChildren, isPending }) =>
                !!icon && (
                  <span className={cls("icon")}>
                    {replaceIconWhenPending && isPending
                      ? defaultChildren
                      : icon}
                  </span>
                ),
            )({
              ...renderProps,
              defaultChildren: replaceIconWhenPending ? (
                // @ts-expect-error RMWC types are wrong
                <CircularProgress />
              ) : undefined,
            })}
            {iconOnly ? <span className="sr-only">{children}</span> : children}
          </>
        );
      })}
    </AriaButton>
  );
}
