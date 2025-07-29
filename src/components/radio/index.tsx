import type {
  RadioGroupProps as AriaRadioGroupProps,
  RadioProps as AriaRadioProps,
  ValidationResult,
} from "react-aria-components";
import {
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  composeRenderProps,
  FieldError,
  Label,
  Text,
} from "react-aria-components";
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

export interface RadioGroupProps extends AriaRadioGroupProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function RadioGroup({
  className,
  children,
  label,
  description,
  errorMessage,
  ...props
}: RadioGroupProps) {
  return (
    <AriaRadioGroup
      {...props}
      className={composeClasses(cls("group"), className)}
    >
      {composeRenderProps(children, (children) => (
        <>
          {label && (
            <Label
              className={cls({
                element: "group-label",
                extra: "subtitle1",
              })}
            >
              {label}
            </Label>
          )}
          {children}
          {description && (
            <Text
              className={cls({
                element: "group-description",
                extra: "caption",
              })}
              slot="description"
            >
              {description}
            </Text>
          )}
          <FieldError
            className={cls({
              element: "group-error",
              extra: "caption",
            })}
          >
            {errorMessage}
          </FieldError>
        </>
      ))}
    </AriaRadioGroup>
  );
}

export interface TwoLineRadioLabelProps {
  label: string;
  description: string;
}

export function TwoLineRadioLabel({
  label,
  description,
}: TwoLineRadioLabelProps) {
  return (
    <span className={cls("two-line-label")}>
      <span className={cls({ element: "two-line-label-text", extra: "body1" })}>
        {label}
      </span>
      <span
        className={cls({
          element: "two-line-label-description",
          extra: "caption",
        })}
      >
        {description}
      </span>
    </span>
  );
}
