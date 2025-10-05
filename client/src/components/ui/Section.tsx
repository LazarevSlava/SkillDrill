import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../shared/utils";

type Props = HTMLAttributes<HTMLElement> & {
  as?: keyof HTMLElementTagNameMap;
  children: ReactNode;
};
export default function Section({
  as: Tag = "section",
  className,
  ...rest
}: Props) {
  return <Tag className={cx("section", className)} {...rest} />;
}
