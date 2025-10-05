import * as React from "react";
import type { TextareaHTMLAttributes, ReactNode } from "react";
import { cx } from "../../shared/utils";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode | boolean;
  required?: boolean;
};

export default function TextArea({
  id,
  label,
  helperText,
  error,
  className,
  rows = 4,
  required,
  ...rest
}: Props) {
  const autoId = React.useId();
  const inputId = id ?? autoId;
  const describedById = helperText ? `${inputId}-desc` : undefined;
  const errorId = typeof error === "string" ? `${inputId}-err` : undefined;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-medium text-[color:var(--color-deep-blue)]"
        >
          {label}
          {required && <span className="ml-1 text-red-600">*</span>}
        </label>
      )}

      <textarea
        id={inputId}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={cx(describedById, errorId)}
        className={cx(
          "input resize-y leading-relaxed",
          error &&
            "border-red-400 ring-0 focus:border-red-400 focus:ring-2 focus:ring-red-500",
          className,
        )}
        {...rest}
      />

      {helperText && (
        <p
          id={describedById}
          className="mt-1 text-sm text-[color:var(--color-gray-blue)]"
        >
          {helperText}
        </p>
      )}
      {typeof error === "string" && (
        <p id={errorId} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      {error === true && (
        <p className="mt-1 text-sm text-red-600">Есть ошибка в этом поле.</p>
      )}
    </div>
  );
}
