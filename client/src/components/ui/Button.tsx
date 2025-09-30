import * as React from "react";

type Variant = "primary" | "brand" | "secondary" | "outline" | "ghost" | "link";
type Size = "sm" | "md" | "lg";

/** Общие для обеих версий (button/anchor) */
type CommonProps = {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
};

/** Версия-кнопка (дефолтная) */
type AsButtonProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: "button";
    href?: never;
  };

/** Версия-ссылка */
type AsAnchorProps = CommonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: "a";
    href: string;
  };

export type ButtonProps = AsButtonProps | AsAnchorProps;

type ButtonElement = HTMLButtonElement | HTMLAnchorElement;

const base =
  "inline-flex items-center justify-center rounded-2xl font-semibold transition " +
  "focus:outline-none focus:ring-2 focus:ring-offset-2";

const variants: Record<Variant, string> = {
  primary:
    "bg-[color:var(--color-yellow)] text-[color:var(--color-dark-gray)] hover:bg-[color:var(--color-yellow)]/90 focus:ring-[color:var(--color-yellow)]/50",
  brand:
    "bg-[color:var(--color-deep-blue)] text-white hover:bg-[color:var(--color-gray-blue)] focus:ring-[color:var(--color-light-blue)]",
  secondary:
    "bg-[color:var(--color-light-blue)] text-[color:var(--color-dark-gray)] hover:bg-[color:var(--color-gray-blue)]/40 focus:ring-[color:var(--color-light-blue)]",
  outline:
    "bg-[color:var(--color-white)] text-[color:var(--color-dark-gray)] border border-[color:var(--color-light-blue)] hover:bg-[color:var(--color-light-blue)]/15 focus:ring-[color:var(--color-light-blue)]",
  ghost:
    "bg-transparent text-[color:var(--color-dark-gray)] hover:bg-[color:var(--color-light-blue)]/30 focus:ring-[color:var(--color-light-blue)]",
  link: "bg-transparent text-[color:var(--color-deep-blue)] underline underline-offset-2 hover:opacity-80 focus:ring-[color:var(--color-light-blue)]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-base",
  lg: "h-12 px-6 text-lg",
};

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

const Button = React.forwardRef<ButtonElement, ButtonProps>(
  function Button(props, ref) {
    const {
      variant = "primary",
      size = "md",
      isLoading = false,
      className,
      children,
      ...rest
    } = props;

    const disabled = "disabled" in rest ? Boolean(rest.disabled) : false; // корректно для обеих веток

    const disabledClasses =
      disabled || isLoading
        ? (variant === "primary" ||
          variant === "brand" ||
          variant === "secondary"
            ? "opacity-70 "
            : "") + "cursor-not-allowed"
        : "";

    const classes = cx(
      base,
      variants[variant],
      sizes[size],
      disabledClasses,
      className,
    );

    if (props.as === "a") {
      const { href, onClick, ...anchorRest } = rest as Omit<
        AsAnchorProps,
        keyof CommonProps
      >;

      const safeOnClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
        if (disabled || isLoading) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        onClick?.(e);
      };

      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          aria-disabled={disabled || isLoading || undefined}
          onClick={safeOnClick}
          {...anchorRest}
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <Spinner />
              <span>Please wait…</span>
            </span>
          ) : (
            children
          )}
        </a>
      );
    }

    // Ветка обычной кнопки
    const { type, onClick, ...buttonRest } = rest as Omit<
      AsButtonProps,
      keyof CommonProps
    >;

    const safeOnClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      if (disabled || isLoading) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onClick?.(e);
    };

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type ?? "button"} // безопасный дефолт: не сабмитим форму случайно
        className={classes}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        onClick={safeOnClick}
        {...buttonRest}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <Spinner />
            <span>Please wait…</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
export default Button;

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}
