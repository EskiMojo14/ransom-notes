import type { RadioProps as AriaRadioProps } from "react-aria-components";
import { Radio as AriaRadio, composeRenderProps } from "react-aria-components";
import { bemHelper, composeClasses } from "@/utils/rac";

export interface RadioProps extends AriaRadioProps {}

const cls = bemHelper("radio");

export function Radio({ className, children, ...props }: AriaRadioProps) {
  return (
    <AriaRadio {...props} className={composeClasses(cls(), className)}>
      {composeRenderProps(children, (children) => (
        <>
          <span className={cls("icon")}>
            <span className={cls("dot")} />
          </span>
          {children}
        </>
      ))}
    </AriaRadio>
  );
}
