import * as React from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cx } from "../../shared/utils";

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: ReactNode;
  description?: ReactNode;
};

export function Radio({
  id,
  label,
  description,
  className,
  ...rest
}: RadioProps) {
  const autoId = React.useId();
  const inputId = id ?? autoId;
  const descId = description ? `${inputId}-desc` : undefined;

  return (
    <label
      htmlFor={inputId}
      className={cx(
        "flex cursor-pointer items-start gap-3 rounded-2xl border p-3 transition",
        "border-[color:var(--color-light-blue)]/40 hover:shadow-soft",
        className,
      )}
    >
      <input
        id={inputId}
        type="radio"
        className={cx(
          "mt-0.5 h-4 w-4 rounded-full border outline-none",
          "border-[color:var(--color-deep-blue)]/50",
          "accent-[color:var(--color-deep-blue)]",
          "focus:ring-2 focus:ring-[color:var(--color-deep-blue)]",
        )}
        aria-describedby={descId}
        {...rest}
      />
      <span className="flex-1">
        {label && (
          <span className="block text-sm font-medium text-[color:var(--color-dark-gray)] dark:text-white">
            {label}
          </span>
        )}
        {description && (
          <span
            id={descId}
            className="mt-0.5 block text-sm text-[color:var(--color-gray-blue)]"
          >
            {description}
          </span>
        )}
      </span>
    </label>
  );
}

/** Простой RadioGroup из массива опций */
export type RadioOption<T extends string | number = string> = {
  value: T;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
};

type RadioGroupProps<T extends string | number = string> = {
  name: string;
  value?: T;
  onChange?: (value: T) => void;
  options: RadioOption<T>[];
  className?: string;
};

export function RadioGroup<T extends string | number = string>({
  name,
  value,
  onChange,
  options,
  className,
}: RadioGroupProps<T>) {
  return (
    <div className={cx("grid gap-2", className)}>
      {options.map((opt) => (
        <Radio
          key={String(opt.value)}
          name={name}
          checked={value === opt.value}
          onChange={() => onChange?.(opt.value)}
          label={opt.label}
          description={opt.description}
          disabled={opt.disabled}
          value={opt.value}
        />
      ))}
    </div>
  );
}

export default Radio;
