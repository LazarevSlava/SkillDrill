import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../shared/utils";

type Props = HTMLAttributes<HTMLSpanElement> & {
  intent?: "neutral" | "info" | "success" | "warning";
  children: ReactNode;
};
const map = {
  neutral: "badge",
  info: "badge bg-brand-light/60 text-brand-deep",
  success: "badge bg-green-100 text-green-800",
  warning: "badge bg-yellow-100 text-yellow-800",
};
export default function Badge({
  intent = "neutral",
  className,
  ...rest
}: Props) {
  return <span className={cx(map[intent], className)} {...rest} />;
}
