import { mergeRefs } from "@react-aria/utils";
import { radEventListeners } from "rad-event-listeners";
import type { ReactNode, RefAttributes, RefCallback } from "react";
import { useCallback, useEffect, useState } from "react";
import type {
  TextFieldProps as AriaTextFieldProps,
  ValidationResult,
} from "react-aria-components";
import {
  FieldError,
  Text,
  TextField as AriaTextField,
  Label,
  Input,
  TextArea,
} from "react-aria-components";
import { safeAssign } from "@/utils";
import { bemHelper, composeClasses } from "@/utils/rac";

export interface TextFieldProps extends AriaTextFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  multiline?: boolean;
  icon?: ReactNode;
  placeholder?: string;
}

export const cls = bemHelper("textfield");

function useTextareaResize(): {
  ref: RefCallback<HTMLTextAreaElement>;
  onChange: () => void;
} {
  const [input, setRef] = useState<HTMLTextAreaElement | null>(null);
  const onChange = useCallback(() => {
    if (!input) return;
    const { alignSelf: prevAlignment, overflow: prevOverflow } = input.style;

    safeAssign(input.style, {
      alignSelf: "start",
      overflow: "hidden",
      height: "auto",
    });

    input.style.height = `${input.scrollHeight + (input.offsetHeight - input.clientHeight)}px`;

    safeAssign(input.style, {
      alignSelf: prevAlignment,
      overflow: prevOverflow,
    });
  }, [input]);
  useEffect(() => {
    if (!input?.form) return;
    let timeoutId: ReturnType<typeof setTimeout>;
    const unsub = radEventListeners(input.form, {
      reset() {
        timeoutId = setTimeout(onChange, 0);
      },
    });
    return () => {
      unsub();
      clearTimeout(timeoutId);
    };
  }, [input?.form, onChange]);
  return { ref: setRef, onChange };
}

export function TextField({
  label,
  description,
  placeholder,
  errorMessage,
  className,
  multiline,
  ref,
  ...props
}: TextFieldProps & RefAttributes<HTMLInputElement & HTMLTextAreaElement>) {
  const { ref: innerRef, onChange } = useTextareaResize();
  return (
    <AriaTextField
      {...props}
      className={composeClasses(
        cls({ modifiers: { multiline: !!multiline } }),
        className,
      )}
    >
      {label && (
        <Label
          className={cls({
            element: "label",
            extra: "subtitle1",
          })}
        >
          {label}
        </Label>
      )}
      <label className={cls("input-container")}>
        {!!props.icon && <div className={cls("icon")}>{props.icon}</div>}
        {multiline ? (
          <TextArea
            className={cls({
              element: "input",
              modifier: "textarea",
              extra: "body1",
            })}
            placeholder={placeholder}
            ref={mergeRefs(ref, innerRef)}
            onChange={onChange}
          />
        ) : (
          <Input
            className={cls({
              element: "input",
              modifier: "input",
              extra: "body1",
            })}
            placeholder={placeholder}
            ref={ref}
          />
        )}
      </label>
      {description && (
        <Text
          className={cls({
            element: "description",
            extra: "caption",
          })}
          slot="description"
        >
          {description}
        </Text>
      )}
      <FieldError
        className={cls({
          element: "error",
          extra: "caption",
        })}
      >
        {errorMessage}
      </FieldError>
    </AriaTextField>
  );
}
