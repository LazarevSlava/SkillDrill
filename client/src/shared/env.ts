type StubMode = "off" | "always" | "fallback";

type ViteEnvShape = {
  VITE_API_BASE_URL?: string;
  VITE_AUTH_STUB?: StubMode;
};

const viteEnv = (import.meta as unknown as { env?: ViteEnvShape }).env ?? {};

export const API_BASE = viteEnv.VITE_API_BASE_URL ?? "http://localhost:8080";
export const AUTH_STUB: StubMode = (viteEnv.VITE_AUTH_STUB ??
  "off") as StubMode;
export type { StubMode };
