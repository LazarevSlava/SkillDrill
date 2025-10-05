import * as React from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../shared/utils";

type Variant = "info" | "success" | "warning" | "error";

type Props = HTMLAttributes<HTMLDivElement> & {
  variant?: Variant;
  title?: ReactNode;
  children?: ReactNode;
  dismissible?: boolean;
  onClose?: () => void;
};

const VARIANT_STYLES: Record<
  Variant,
  {
    bg: string;
    border: string;
    text: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
  }
> = {
  info: {
    bg: "bg-[color:var(--color-light-blue)]/25",
    border: "border-[color:var(--color-light-blue)]/60",
    text: "text-[color:var(--color-deep-blue)]",
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 8h.01M11 11h2v6h-2z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  success: {
    bg: "bg-green-50",
    border: "border-green-400",
    text: "text-green-700",
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" {...props}>
        <path
          d="M20 6 9 17l-5-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  warning: {
    bg: "bg-[color:var(--color-yellow)]/20",
    border: "border-[color:var(--color-yellow)]/60",
    text: "text-[color:var(--color-dark-gray)]",
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" {...props}>
        <path
          d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-400",
    text: "text-red-700",
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" {...props}>
        <path
          d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
};

export default function Alert({
  variant = "info",
  title,
  children,
  dismissible,
  onClose,
  className,
  ...rest
}: Props) {
  const styles = VARIANT_STYLES[variant];
  const Icon = styles.icon;

  return (
    <div
      role="alert"
      className={cx(
        "card shadow-soft",
        "flex items-start gap-3 border",
        styles.bg,
        styles.border,
        styles.text,
        className,
      )}
      {...rest}
    >
      <div className="mt-0.5 shrink-0">
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex-1">
        {title && <div className="font-semibold">{title}</div>}
        {children && (
          <div className="mt-1 text-sm leading-relaxed">{children}</div>
        )}
      </div>

      {dismissible && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className={cx(
            "ml-2 inline-flex h-7 w-7 items-center justify-center rounded-full",
            "hover:bg-black/5 focus:outline-none focus:ring-2",
            "focus:ring-[color:var(--color-deep-blue)]",
          )}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
