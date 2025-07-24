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

const classes = bemHelper("textfield");

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
        classes({ modifiers: { multiline: !!multiline } }),
        className,
      )}
    >
      <Label
        className={classes({
          element: "label",
          extra: "body1",
        })}
      >
        {label}
      </Label>
      <label className={classes("input-container")}>
        {!!props.icon && <div className={classes("icon")}>{props.icon}</div>}
        {multiline ? (
          <TextArea
            className={classes({
              element: "input",
              modifier: "textarea",
              extra: "body1",
            })}
            placeholder={placeholder}
          />
        ) : (
          <Input
            className={classes({
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
          className={classes({
            element: "description",
            extra: "caption",
          })}
          slot="description"
        >
          {description}
        </Text>
      )}
      <FieldError
        className={classes({
          element: "error",
          extra: "caption",
        })}
      >
        {errorMessage}
      </FieldError>
    </AriaTextField>
  );
}
