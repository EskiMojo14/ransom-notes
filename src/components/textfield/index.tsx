import { mergeRefs } from "@react-aria/utils";
import type { ReactNode, RefAttributes } from "react";
import { useRef } from "react";
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

interface TextFieldProps extends AriaTextFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  multiline?: boolean;
  icon?: ReactNode;
  placeholder?: string;
}

const cls = bemHelper("textfield");

function useTextareaResize() {
  const ref = useRef<HTMLTextAreaElement>(null);
  function onChange() {
    const input = ref.current;
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
  }
  return { ref, onChange };
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
            extra: "body1",
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
