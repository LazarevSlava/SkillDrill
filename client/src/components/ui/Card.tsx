import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../shared/utils";

type Props = HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "outline" | "hover";
  children: ReactNode;
};
export default function Card({
  variant = "default",
  className,
  ...rest
}: Props) {
  return (
    <div
      className={cx(
        "card p-6",
        variant === "outline" && "shadow-none border border-brand-light",
        variant === "hover" && "transition hover:shadow-card",
        className,
      )}
      {...rest}
    />
  );
}
