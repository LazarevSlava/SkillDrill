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
    "bg-brand-yellow text-brand-dark hover:bg-brand-yellow/90 focus:ring-brand-yellow/50",
  brand:
    "bg-brand-deep text-white hover:bg-brand-gray-blue focus:ring-brand-light",
  secondary:
    "bg-brand-light text-brand-dark hover:bg-brand-gray-blue/40 focus:ring-brand-light",
  outline:
    "bg-brand-white text-brand-dark border border-brand-light hover:bg-brand-light/15 focus:ring-brand-light",
  ghost:
    "bg-transparent text-brand-dark hover:bg-brand-light/30 focus:ring-brand-light",
  link: "bg-transparent text-brand-deep underline underline-offset-2 hover:opacity-80 focus:ring-brand-light",
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
