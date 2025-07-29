import type { ValidationErrors } from "@react-types/shared";
import type { FormDataInfo } from "decode-formdata";
import { decode } from "decode-formdata";
import type { FormEvent } from "react";
import { useState } from "react";
import * as v from "valibot";

export function useFormSchema<T extends v.GenericSchema>(
  schema: T,
  formInfo: FormDataInfo = {},
) {
  const [formErrors, setFormErrors] = useState<ValidationErrors>();
  function handleSubmit(
    onSuccess: (output: v.InferOutput<T>) => void | Promise<void>,
    onError?: (
      issues: [v.InferIssue<T>, ...Array<v.InferIssue<T>>],
    ) => void | Promise<void>,
  ) {
    return function onSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const decoded = decode(formData, formInfo);
      const parseRes = v.safeParse(schema, decoded);
      if (!parseRes.success) {
        setFormErrors(v.flatten(parseRes.issues).nested as ValidationErrors);
        void onError?.(parseRes.issues);
        return;
      }
      setFormErrors(undefined);
      void onSuccess(parseRes.output);
    };
  }
  return { handleSubmit, formErrors };
}
