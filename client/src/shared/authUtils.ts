import { ApiErrCode, ApiErrorField } from "./authTypes";

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function normalizeLower(s?: string) {
  return s?.trim().toLowerCase() ?? "";
}

export function extractErrorCode(err: ApiErrorField): ApiErrCode | undefined {
  if (!err) return undefined;
  if (typeof err === "string") return err as ApiErrCode;
  if (typeof err === "object" && "code" in err)
    return (err as { code?: ApiErrCode }).code;
  return undefined;
}

export function mapErrorCodeToMessage(
  code?: ApiErrCode,
  fallback = "Ошибка сервера",
) {
  switch (code) {
    case "name_taken":
      return "Это имя уже занято";
    case "email_taken":
      return "Этот e-mail уже используется";
    case "invalid_email":
      return "Неверный формат e-mail";
    case "password_too_short":
      return "Слишком короткий пароль (мин. 6 символов)";
    case "invalid_credentials":
      return "Неверные имя пользователя или пароль";
    case "name_and_password_required":
      return "Укажите имя пользователя и пароль";
    case "validation_error":
      return "Некорректные данные формы";
    default:
      return fallback;
  }
}

// Единый fetch с JSON + cookie
export async function jsonFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    credentials: "include",
  });
  const data = (await res.json().catch(() => ({}))) as T;
  return data;
}
