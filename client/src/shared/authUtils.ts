// client/src/shared/authUtils.ts
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

/** Безопасный парсинг JSON: на выходе unknown (или исходная строка при ошибке). */
function safeParse(text: string): unknown {
  if (!text) return {};
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

/** Аккуратно достаём код ошибки из неизвестного ответа без обращения к произвольным полям объекта. */
function pickErrorCode(u: unknown): string | undefined {
  if (typeof u !== "object" || u === null) return undefined;
  const o = u as Record<string, unknown>;
  if (typeof o.error === "string") return o.error;
  if (typeof o.code === "string") return o.code;
  return undefined;
}

/** Типизированная ошибка HTTP вместо наращивания полей на Error через `any`. */
export class HttpError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.payload = payload;
  }
}

export async function jsonFetch<T>(
  url: string,
  init: RequestInit = {},
): Promise<T> {
  const method = (init.method || "GET").toUpperCase();

  // Готовим тело: если прилетел объект — превратим в строку
  let body: BodyInit | undefined = init.body as BodyInit | undefined;
  if (body && typeof body !== "string") {
    try {
      body = JSON.stringify(body);
    } catch {
      // Не падаем на циклических структурах — отправим как есть (или можешь поставить throw)
      body = undefined;
    }
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init.headers || {}),
  };

  const request: RequestInit = {
    ...init,
    method,
    credentials: "include",
    headers,
    body,
  };

  const res = await fetch(url, request);
  const text = await res.text();
  const data: unknown = safeParse(text);

  if (!res.ok) {
    const code = pickErrorCode(data) ?? `http_${res.status}`;
    throw new HttpError(code, res.status, data);
  }

  // На этом уровне мы доверяем дженерику T и приводим unknown → T
  return data as T;
}
