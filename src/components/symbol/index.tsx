import { clsx } from "clsx";
import type { ComponentPropsWithRef } from "react";
import { bemHelper } from "@/utils/rac";

export interface SymbolProps extends ComponentPropsWithRef<"span"> {
  fill?: boolean;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  /** -25 (low emphasis) to 200 (high emphasis), defaults to 0 */
  grade?: number;
  /** 20px to 48px, defaults to `size` */
  opticalSize?: number;

  /** defaults to 24 */
  size?: number;
  /** Whether the icon should be flipped vertically in RTL */
  flipRtl?: boolean;
}

const cls = bemHelper("symbol");

export function Symbol({
  fill,
  weight,
  grade,
  opticalSize,
  size,
  flipRtl = false,
  className,
  ...props
}: SymbolProps) {
  return (
    <span
      aria-hidden="true"
      {...props}
      className={cls({
        modifiers: {
          "flip-rtl": flipRtl,
        },
        extra: clsx("material-symbols-outlined", className),
      })}
      style={{
        "--icon-size": size,
        "--icon-weight": weight,
        "--icon-grade": grade,
        "--icon-optical-size": opticalSize,
        "--icon-fill": fill ? 1 : 0,
      }}
    />
  );
}
