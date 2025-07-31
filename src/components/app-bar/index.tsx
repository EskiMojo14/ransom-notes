import type { ReactNode } from "react";
import { Toolbar } from "react-aria-components";
import { bemHelper } from "@/utils/rac";

export interface AppBarProps {
  actions?: ReactNode;
}

const cls = bemHelper("app-bar");

export function AppBar({ actions }: AppBarProps) {
  return (
    <header className={cls()}>
      <h1 className={cls({ element: "title", extra: "headline5" })}>
        Ransom Notes
      </h1>
      <Toolbar className={cls("actions")}>{actions}</Toolbar>
    </header>
  );
}
