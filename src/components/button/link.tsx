import { createLink } from "@tanstack/react-router";
import type { RefAttributes } from "react";
import type { LinkProps, LinkRenderProps } from "react-aria-components";
import { Link, composeRenderProps } from "react-aria-components";
import type { ButtonCommonProps } from ".";
import { getButtonClasses, cls } from ".";

export interface LinkButtonProps
  extends ButtonCommonProps<LinkRenderProps>,
    Omit<LinkProps, keyof ButtonCommonProps<LinkRenderProps>> {}

export function _LinkButton({
  className,
  icon,
  children,
  variant,
  color,
  iconOnly,
  ...props
}: LinkButtonProps & RefAttributes<HTMLAnchorElement>) {
  return (
    <Link
      {...props}
      className={getButtonClasses({ className, variant, color, iconOnly })}
    >
      {composeRenderProps(children, (children, renderProps) => (
        <>
          {composeRenderProps(
            icon,
            (icon) => !!icon && <span className={cls("icon")}>{icon}</span>,
          )(renderProps)}
          {iconOnly ? <span className="sr-only">{children}</span> : children}
        </>
      ))}
    </Link>
  );
}

export const LinkButton = createLink(_LinkButton);
