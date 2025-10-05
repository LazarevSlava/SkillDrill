// Checkbox.tsx
import type { InputHTMLAttributes, ReactNode } from "react";
export default function Checkbox({
  children,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { children?: ReactNode }) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input type="checkbox" className="accent-brand-deep" {...rest} />
      {children}
    </label>
  );
}
