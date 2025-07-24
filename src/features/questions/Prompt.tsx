import type { ReactNode } from "react";
import styles from "./Prompt.module.css";

export interface PromptProps {
  children: ReactNode;
}

export function Prompt({ children }: PromptProps) {
  return (
    <div className={styles.prompt}>
      <h5 className={styles.text}>{children}</h5>
    </div>
  );
}
