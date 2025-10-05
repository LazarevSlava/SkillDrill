import type { InputHTMLAttributes, ReactNode } from "react";
import { cx } from "../../shared/utils";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  left?: ReactNode;
  right?: ReactNode;
};
export default function Input({
  label,
  hint,
  error,
  left,
  right,
  className,
  id,
  ...rest
}: Props) {
  const inputId = id ?? rest.name ?? Math.random().toString(36).slice(2);
  return (
    <label htmlFor={inputId} className="block">
      {label && (
        <div className="mb-1 text-sm font-medium text-brand-deep dark:text-brand-white">
          {label}
        </div>
      )}
      <div className={cx("relative flex items-center")}>
        {left && <span className="absolute left-3">{left}</span>}
        <input
          id={inputId}
          className={cx(
            "input",
            left && "pl-10",
            right && "pr-10",
            error && "border-red-300 ring-2 ring-red-200 focus:ring-red-300",
            className,
          )}
          {...rest}
        />
        {right && <span className="absolute right-3">{right}</span>}
      </div>
      {error ? (
        <div className="mt-1 text-sm text-red-600">{error}</div>
      ) : hint ? (
        <div className="mt-1 text-sm text-brand-gray-blue">{hint}</div>
      ) : null}
    </label>
  );
}
