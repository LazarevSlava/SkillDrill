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
  showBottomToggle?: boolean; // ПО УМОЛЧАНИЮ false — чтобы избежать «дублирования»
};

type FormValues = {
  username?: string;
  email: string;
  password: string;
};

// env без any
const viteEnv = (
  import.meta as unknown as {
    env?: { VITE_API_BASE_URL?: string; VITE_AUTH_STUB?: StubMode };
  }
).env;

const API_BASE = viteEnv?.VITE_API_BASE_URL ?? "http://localhost:4000";
const ENV_STUB: StubMode = (viteEnv?.VITE_AUTH_STUB ?? "off") as StubMode;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function RegisterForm({
  mode: initialMode = "signup",
  onSuccess,
  stub,
  showBottomToggle = false, // <— по умолчанию отключено, чтобы не было «повтора»
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

  // единый класс для инпутов
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

  const onSuccessOrGoApp = () => {
    (onSuccess ?? (() => navigate("/app")))();
  };

  const simulateSuccess = async () => {
    await sleep(450);
    onSuccessOrGoApp();
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
        const res = await fetch(`${API_BASE}/api/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.username?.trim(),
            password: data.password,
            // email: data.email?.trim(), // включишь, когда бэк будет ждать email
          }),
        });

        const payload: unknown = await res.json().catch(() => ({}));
        if (!res.ok) {
          const errCode = (payload as { error?: string } | undefined)?.error;
          const msg =
            errCode === "name_taken"
              ? "Это имя уже занято"
              : errCode === "password_too_short"
                ? "Слишком короткий пароль (мин. 6 символов)"
                : "Ошибка сервера. Попробуй ещё раз";

          if (stubMode === "fallback") {
            console.warn(
              "[RegisterForm] AUTH_STUB=fallback → API ошибка, имитируем успех",
            );
            await simulateSuccess();
            return;
          }
          throw new Error(msg);
        }
      } else {
        const res = await fetch(`${API_BASE}/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email?.trim(),
            password: data.password,
          }),
        });

        const payload: unknown = await res.json().catch(() => ({}));
        if (!res.ok) {
          const errCode = (payload as { error?: string } | undefined)?.error;
          const msg =
            errCode === "invalid_credentials"
              ? "Неверный логин или пароль"
              : "Ошибка входа. Попробуй ещё раз";

          if (stubMode === "fallback") {
            console.warn(
              "[RegisterForm] AUTH_STUB=fallback → API ошибка, имитируем успех",
            );
            await simulateSuccess();
            return;
          }
          throw new Error(msg);
        }
      }

      onSuccessOrGoApp();
    } catch (e: unknown) {
      if (stubMode === "fallback") {
        console.warn(
          "[RegisterForm] AUTH_STUB=fallback → сеть/исключение, имитируем успех",
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
      {/* Переключатель режимов (вверху — основной, чтобы НЕ дублировать снизу) */}
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
          Email
        </label>
        <input
          type="email"
          className={inputClass}
          placeholder="you@example.com"
          {...register("email", { required: "Email is required" })}
          disabled={loading || isSubmitting}
          autoComplete="email"
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

      {/* НИЖНИЙ переключатель — по желанию. По умолчанию скрыт, чтобы не дублировать. */}
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
