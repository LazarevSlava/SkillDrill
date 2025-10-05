import * as React from "react";
import { cx } from "../../shared/utils";

type BaseProps = {
  className?: string;
  width?: number | string;
  height?: number | string;
  rounded?: boolean;
};

type Variant = "text" | "rect" | "circle" | "title";

type Props = BaseProps & { variant?: Variant };

/**
 * Универсальный скелетон.
 * - variant="text" — строка текста
 * - variant="title" — заголовок (чуть выше)
 * - variant="rect" — прямоугольник произвольного размера
 * - variant="circle" — круг (если задан размер)
 */
export default function Skeleton({
  variant = "text",
  className,
  width,
  height,
  rounded = true,
}: Props) {
  const style: React.CSSProperties = {
    width: width ?? (variant === "text" ? "100%" : undefined),
    height:
      height ??
      (variant === "text"
        ? 14
        : variant === "title"
          ? 20
          : variant === "circle"
            ? 40
            : 80),
  };

  const shape =
    variant === "circle"
      ? "rounded-full"
      : rounded
        ? "rounded-2xl"
        : "rounded-none";

  return (
    <div
      className={cx(
        "relative overflow-hidden",
        "animate-pulse",
        "bg-[color:var(--color-light-blue)]/30",
        shape,
        className,
      )}
      style={style}
      aria-hidden="true"
    >
      {/* Мягкий шиммер */}
      <span
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/2 translate-x-0 skew-x-[-12deg] bg-gradient-to-r from-transparent via-white/35 to-transparent"
        style={{ filter: "blur(6px)" }}
      />
    </div>
  );
}
