import { createLink } from "@tanstack/react-router";
import type { RefAttributes } from "react";
import { Link as AriaLink, type LinkProps } from "react-aria-components";
import { composeClasses } from "@/utils/rac";

export function _Link({
  className,
  ...props
}: LinkProps & RefAttributes<HTMLAnchorElement>) {
  return <AriaLink {...props} className={composeClasses("link", className)} />;
}

export const Link = createLink(_Link);
