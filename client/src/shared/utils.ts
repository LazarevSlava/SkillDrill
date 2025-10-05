export function cx(...args: unknown[]): string {
  return args.filter(Boolean).join(" ");
}
