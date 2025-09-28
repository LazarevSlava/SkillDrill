// src/forms/RegisterForm.tsx
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type Mode = "signin" | "signup";
type StubMode = "off" | "always" | "fallback";

export type RegisterFormProps = {
  mode?: Mode;
  onSuccess?: () => void; // если не задан, делаем navigate('/app')
  stub?: StubMode; // переопределяет .env
  showBottomToggle?: boolean; // по умолчанию false
};

type FormValues = {
  username?: string; // используется в signup
  email: string; // в signin играёт роль username (name)
  password: string;
};

// ---- Контракт с бэком ----
// Сервер отдаёт { ok: true, user: {...} } или { ok: false, error: ... }
type ApiUser = { id: string; name: string; createdAt?: string };
type ApiOk = { ok: true; user: ApiUser };
type ApiErrCode =
  | "name_taken"
  | "email_taken"
  | "password_too_short"
  | "invalid_credentials"
  | "validation_error"
  | "name_and_password_required"
  | "server_error";
type ApiError = { ok: false; error?: { code?: ApiErrCode; message?: string } };
type SignupResponse = ApiOk | ApiError;
type LoginResponse = ApiOk | ApiError;

// env без any
const viteEnv = (
  import.meta as unknown as {
    env?: { VITE_API_BASE_URL?: string; VITE_AUTH_STUB?: StubMode };
  }
).env;

const API_BASE = viteEnv?.VITE_API_BASE_URL ?? "http://localhost:8080";
const ENV_STUB: StubMode = (viteEnv?.VITE_AUTH_STUB ?? "off") as StubMode;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Единый fetch с JSON + cookie
async function jsonFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    credentials: "include", // cookie-based auth
  });
  const data = (await res.json().catch(() => ({}))) as T;
  return data;
}

export default function RegisterForm({
  mode: initialMode = "signup",
  onSuccess,
  stub,
  showBottomToggle = false,
}: RegisterFormProps) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    defaultValues: { username: "", email: "", password: "" },
  });

  const inputClass =
    "w-full rounded-xl border px-4 py-2 outline-none " +
    "border-[color:var(--color-light-blue)] " +
    "focus:ring-2 focus:ring-[color:var(--color-yellow)] " +
    "bg-[color:var(--color-white)] text-[color:var(--color-dark-gray)] " +
    "placeholder:text-[color:var(--color-gray-blue)]/70";

  useEffect(() => {
    reset({ username: "", email: "", password: "" });
    setServerError(null);
  }, [mode, reset]);

  const usernameRequired = useMemo(() => mode === "signup", [mode]);
  const stubMode: StubMode = stub ?? ENV_STUB;

  const onSuccessOrGoApp = () => (onSuccess ?? (() => navigate("/app")))();

  const simulateSuccess = async () => {
    await sleep(450);
    onSuccessOrGoApp();
  };

  const mapErrorCodeToMessage = (
    code?: ApiErrCode,
    fallback = "Ошибка сервера",
  ) => {
    switch (code) {
      case "name_taken":
        return "Это имя уже занято";
      case "email_taken":
        return "Этот e-mail уже используется";
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
  };

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    setLoading(true);
    try {
      if (stubMode === "always") {
        console.warn("[RegisterForm] AUTH_STUB=always → имитируем успех");
        await simulateSuccess();
        return;
      }

      if (mode === "signup") {
        const payload = await jsonFetch<SignupResponse>(`${API_BASE}/users`, {
          method: "POST",
          body: JSON.stringify({
            name: data.username?.trim()?.toLowerCase(),
            password: data.password,
          }),
        });

        if (!("ok" in payload) || !payload.ok) {
          if (stubMode === "fallback") {
            console.warn(
              "[RegisterForm] fallback → signup ошибка, имитируем успех",
            );
            await simulateSuccess();
            return;
          }
          const msg = mapErrorCodeToMessage(
            (payload as ApiError)?.error?.code,
            "Ошибка регистрации",
          );
          throw new Error(msg);
        }
      } else {
        // signin: используем поле ниже, подписанное как Username
        const nameForLogin = (data.username ?? data.email)
          ?.trim()
          ?.toLowerCase();
        const payload = await jsonFetch<LoginResponse>(
          `${API_BASE}/users/login`,
          {
            method: "POST",
            body: JSON.stringify({
              name: nameForLogin,
              password: data.password,
            }),
          },
        );

        if (!("ok" in payload) || !payload.ok) {
          if (stubMode === "fallback") {
            console.warn(
              "[RegisterForm] fallback → login ошибка, имитируем успех",
            );
            await simulateSuccess();
            return;
          }
          const msg = mapErrorCodeToMessage(
            (payload as ApiError)?.error?.code,
            "Ошибка входа",
          );
          throw new Error(msg);
        }
      }

      // если всё ок — кука уже установлена бэкендом
      onSuccessOrGoApp();
    } catch (e: unknown) {
      if (stubMode === "fallback") {
        console.warn(
          "[RegisterForm] fallback → исключение/сеть, имитируем успех",
        );
        await simulateSuccess();
      } else {
        setServerError(e instanceof Error ? e.message : "Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-[color:var(--color-white)] p-6 shadow-md">
      {/* Верхний переключатель режимов */}
      <div className="mb-6 flex justify-center">
        <button
          type="button"
          className={[
            "btn rounded-r-none",
            mode === "signin"
              ? "bg-[color:var(--color-deep-blue)] text-white"
              : "btn-outline",
          ].join(" ")}
          onClick={() => setMode("signin")}
          aria-pressed={mode === "signin"}
          disabled={loading || isSubmitting}
        >
          Sign In
        </button>
        <button
          type="button"
          className={[
            "btn rounded-l-none",
            mode === "signup"
              ? "bg-[color:var(--color-deep-blue)] text-white"
              : "btn-outline",
          ].join(" ")}
          onClick={() => setMode("signup")}
          aria-pressed={mode === "signup"}
          disabled={loading || isSubmitting}
        >
          Sign Up
        </button>
      </div>

      {/* Соц-кнопки (заглушки) */}
      <div className="mb-6 flex flex-col gap-3">
        <button type="button" className="btn btn-outline w-full" disabled>
          Continue with Google
        </button>
        <button type="button" className="btn btn-outline w-full" disabled>
          Continue with GitHub
        </button>
        <button type="button" className="btn btn-outline w-full" disabled>
          Continue with Apple
        </button>
      </div>

      {/* Разделитель */}
      <div className="my-4 flex items-center">
        <hr className="flex-grow border-[color:var(--color-light-blue)]/40" />
        <span className="mx-2 text-sm text-[color:var(--color-gray-blue)]">
          or
        </span>
        <hr className="flex-grow border-[color:var(--color-light-blue)]/40" />
      </div>

      {/* Форма */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {mode === "signup" && (
          <>
            <label className="text-sm font-medium text-[color:var(--color-dark-gray)]">
              Username
            </label>
            <input
              className={inputClass}
              placeholder="e.g. slava_dev"
              {...register(
                "username",
                usernameRequired ? { required: "Username is required" } : {},
              )}
              disabled={loading || isSubmitting}
              autoComplete="username"
            />
            {errors.username && (
              <span className="text-sm text-red-500">
                {errors.username.message}
              </span>
            )}
          </>
        )}

        <label className="text-sm font-medium text-[color:var(--color-dark-gray)]">
          {mode === "signin" ? "Username" : "Email"}
        </label>
        <input
          type={mode === "signin" ? "text" : "email"}
          className={inputClass}
          placeholder={mode === "signin" ? "your_username" : "you@example.com"}
          {...register("email", {
            required:
              mode === "signin" ? "Username is required" : "Email is required",
          })}
          disabled={loading || isSubmitting}
          autoComplete={mode === "signin" ? "username" : "email"}
        />
        {errors.email && (
          <span className="text-sm text-red-500">{errors.email.message}</span>
        )}

        <label className="text-sm font-medium text-[color:var(--color-dark-gray)]">
          Password
        </label>
        <input
          type="password"
          className={inputClass}
          placeholder="••••••••"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Min length is 6" },
          })}
          disabled={loading || isSubmitting}
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
        />
        {errors.password && (
          <span className="text-sm text-red-500">
            {errors.password.message}
          </span>
        )}

        {serverError && (
          <div className="text-sm text-red-600" role="alert" aria-live="polite">
            {serverError}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-full disabled:opacity-70"
          disabled={loading || isSubmitting}
        >
          {loading || isSubmitting
            ? "Please wait..."
            : mode === "signup"
              ? "Create account"
              : "Sign in"}
        </button>
      </form>

      {/* Нижний переключатель — опционально */}
      {showBottomToggle && (
        <p className="mt-3 text-center text-sm text-[color:var(--color-gray-blue)]">
          {mode === "signup" ? (
            <>
              Уже есть аккаунт?{" "}
              <button
                type="button"
                className="font-semibold underline text-[color:var(--color-deep-blue)]"
                onClick={() => setMode("signin")}
                disabled={loading || isSubmitting}
              >
                Войти
              </button>
            </>
          ) : (
            <>
              Нет аккаунта?{" "}
              <button
                type="button"
                className="font-semibold underline text-[color:var(--color-deep-blue)]"
                onClick={() => setMode("signup")}
                disabled={loading || isSubmitting}
              >
                Зарегистрироваться
              </button>
            </>
          )}
        </p>
      )}
    </div>
  );
}
