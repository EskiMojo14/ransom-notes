import type { RefAttributes } from "react";
import {
  FieldError,
  Text,
  TextField as AriaTextField,
  Label,
  Input,
} from "react-aria-components";
import { composeClasses } from "@/utils/rac";
import type { TextFieldProps } from ".";
import { cls } from ".";

export function InlineTextField({
  label,
  description,
  placeholder,
  errorMessage,
  className,
  ref,
  ...props
}: Omit<TextFieldProps, "multiline"> & RefAttributes<HTMLInputElement>) {
  return (
    <AriaTextField
      {...props}
      className={composeClasses(cls({ modifier: "inline" }), className)}
    >
      <div className={cls("inline-text")}>
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
      </div>
      <div className={cls("inline-input-container")}>
        <label className={cls("input-container")}>
          {!!props.icon && <div className={cls("icon")}>{props.icon}</div>}
          <Input
            className={cls({
              element: "input",
              extra: "body1",
            })}
            placeholder={placeholder}
            ref={ref}
          />
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
      </div>
    </AriaTextField>
  );
}
