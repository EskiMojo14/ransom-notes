import { CircularProgress } from "@rmwc/circular-progress";
import "@rmwc/circular-progress/styles";
import type { ReactNode, RefAttributes } from "react";
import type {
  ButtonProps as AriaButtonProps,
  ButtonRenderProps,
} from "react-aria-components";
import {
  Button as AriaButton,
  composeRenderProps,
} from "react-aria-components";
import { bemHelper, composeClasses } from "@/utils/rac";

export const cls = bemHelper("button");

export interface ButtonCommonProps<T> {
  className?: string | ((props: T & { defaultClassName?: string }) => string);
  icon?:
    | ReactNode
    | ((props: T & { defaultChildren?: ReactNode }) => ReactNode);
  variant?: "elevated" | "filled" | "outlined" | "text";
  color?: "primary" | "secondary" | "error";
  iconOnly?: boolean;
  replaceIconWhenPending?: boolean;
}

export interface ButtonProps
  extends ButtonCommonProps<ButtonRenderProps>,
    Omit<AriaButtonProps, keyof ButtonCommonProps<ButtonRenderProps>> {}

export const getButtonClasses = <T,>({
  className,
  variant = "text",
  color = "primary",
  iconOnly = false,
}: Pick<
  ButtonCommonProps<T>,
  "className" | "variant" | "color" | "iconOnly"
>) =>
  composeClasses(
    cls({
      modifiers: {
        [variant]: true,
        [color]: true,
        icon: iconOnly,
      },
    }),
    className,
  );

export function Button({
  className,
  icon,
  children,
  variant,
  color,
  iconOnly,
  replaceIconWhenPending = true,
  ...props
}: ButtonProps & RefAttributes<HTMLButtonElement>) {
  return (
    <AriaButton
      {...props}
      className={getButtonClasses({ className, variant, color, iconOnly })}
    >
      {composeRenderProps(children, (children, renderProps) => (
        <>
          {composeRenderProps(
            icon,
            (icon, { defaultChildren, isPending }) =>
              !!icon && (
                <span className={cls("icon")}>
                  {replaceIconWhenPending && isPending ? defaultChildren : icon}
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
      ))}
    </AriaButton>
  );
}
