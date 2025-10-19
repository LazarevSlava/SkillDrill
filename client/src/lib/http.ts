import { API_BASE } from "../shared/env";

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

/** Допустимые значения в query-строке (мы всё равно приводим к String) */
type QueryValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryValue>;

/** Опции запроса: как RequestInit, но без body + наш query */
type Opts = Omit<RequestInit, "body"> & {
  query?: QueryParams;
};

function withQuery(path: string, query?: QueryParams) {
  if (!query) return path;
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null) continue;
    usp.append(k, String(v));
  }
  const qs = usp.toString();
  return qs ? `${path}?${qs}` : path;
}

async function request<TRes, TBody = unknown>(
  method: string,
  path: string,
  body?: TBody,
  opts: Opts = {},
): Promise<TRes> {
  const url = `${API_BASE}${withQuery(path, opts.query)}`;

  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(opts.headers ?? {}),
  };

  const payload: string | undefined =
    body === undefined
      ? undefined
      : typeof body === "string"
        ? body
        : JSON.stringify(body);

  const res = await fetch(url, {
    method,
    credentials: "include", // важнo: куки для auth
    headers,
    body: payload, // <- теперь тип строго string | undefined, конфликтов нет
    signal: opts.signal,
    // прокинем остальное из opts (кроме headers/signal, уже учтены)
    cache: opts.cache,
    keepalive: opts.keepalive,
    mode: opts.mode,
    redirect: opts.redirect,
    referrer: opts.referrer,
    referrerPolicy: opts.referrerPolicy,
    integrity: opts.integrity,
    window: opts.window,
  });

  // читаем как текст и пытаемся разобрать JSON безопасно
  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text) as unknown;
    } catch {
      data = text; // сервер вернул не-JSON — оставим как сырой текст
    }
  }

  if (!res.ok) {
    const msg =
      (typeof data === "object" &&
        data !== null &&
        "error" in (data as Record<string, unknown>) &&
        typeof (data as { error?: unknown }).error === "string" &&
        (data as { error: string }).error) ||
      `HTTP ${res.status}`;
    throw new ApiError(msg, res.status, data);
  }

  return data as TRes;
}

export const api = {
  get: <TRes>(path: string, opts?: Opts) =>
    request<TRes>("GET", path, undefined, opts),

  post: <TRes, TBody = unknown>(path: string, body?: TBody, opts?: Opts) =>
    request<TRes, TBody>("POST", path, body, opts),

  patch: <TRes, TBody = unknown>(path: string, body?: TBody, opts?: Opts) =>
    request<TRes, TBody>("PATCH", path, body, opts),

  del: <TRes>(path: string, opts?: Opts) =>
    request<TRes>("DELETE", path, undefined, opts),
};
