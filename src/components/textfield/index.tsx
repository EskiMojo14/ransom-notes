import type { ReactNode } from "react";
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

export function TextField({
  label,
  description,
  placeholder,
  errorMessage,
  className,
  multiline,
  ...props
}: TextFieldProps) {
  return (
    <AriaTextField
      {...props}
      className={composeClasses(
        cls({ modifiers: { multiline: !!multiline } }),
        className,
      )}
    >
      <Label
        className={cls({
          element: "label",
          extra: "body1",
        })}
      >
        {label}
      </Label>
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
          />
        ) : (
          <Input
            className={cls({
              element: "input",
              modifier: "input",
              extra: "body1",
            })}
            placeholder={placeholder}
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
