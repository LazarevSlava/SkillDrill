import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

type Mode = "signin" | "signup";

export type RegisterFormProps = {
  mode?: Mode;
  onSuccess?: () => void;
};

type FormValues = {
  username?: string;
  email?: string;
  password: string;
};

// Без any: аккуратно читаем Vite env, с фолбэком на локалку
const viteEnv = (
  import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }
).env;
const API_BASE = viteEnv?.VITE_API_BASE_URL ?? "http://localhost:4000";

export default function RegisterForm({
  mode: initialMode = "signup",
  onSuccess,
}: RegisterFormProps) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: { username: "", email: "", password: "" },
  });

  useEffect(() => {
    reset({ username: "", email: "", password: "" });
    setServerError(null);
  }, [mode, reset]);

  const usernameRequired = useMemo(() => mode === "signup", [mode]);

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const res = await fetch(`${API_BASE}/api/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.username?.trim(),
            password: data.password,
          }),
        });

        const payload: unknown = await res.json().catch(() => ({}));
        if (!res.ok) {
          // узкое приведение типа ответа
          const errCode = (payload as { error?: string } | undefined)?.error;
          const msg =
            errCode === "name_taken"
              ? "Это имя уже занято"
              : errCode === "password_too_short"
                ? "Слишком короткий пароль (мин. 6 символов)"
                : "Ошибка сервера. Попробуй ещё раз";
          throw new Error(msg);
        }
        onSuccess?.();
      } else {
        throw new Error("Вход пока не подключён (нужен /api/login)");
      }
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-md">
      <div className="flex justify-center mb-6">
        <button
          type="button"
          className={[
            "btn",
            mode === "signin"
              ? "bg-[var(--color-deep-blue)] text-white"
              : "btn-outline",
            "rounded-r-none",
          ].join(" ")}
          onClick={() => setMode("signin")}
          aria-pressed={mode === "signin"}
        >
          Sign In
        </button>
        <button
          type="button"
          className={[
            "btn",
            mode === "signup"
              ? "bg-[var(--color-deep-blue)] text-white"
              : "btn-outline",
            "rounded-l-none",
          ].join(" ")}
          onClick={() => setMode("signup")}
          aria-pressed={mode === "signup"}
        >
          Sign Up
        </button>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <button type="button" className="btn btn-outline w-full">
          Continue with Google
        </button>
        <button type="button" className="btn btn-outline w-full">
          Continue with GitHub
        </button>
        <button type="button" className="btn btn-outline w-full">
          Continue with Apple
        </button>
      </div>

      <div className="flex items-center my-4">
        <hr className="flex-grow border-[color-mix(in_oklab,var(--color-light-blue),transparent_60%)]" />
        <span
          className="mx-2 text-sm"
          style={{ color: "var(--color-gray-blue)" }}
        >
          or
        </span>
        <hr className="flex-grow border-[color-mix(in_oklab,var(--color-light-blue),transparent_60%)]" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {mode === "signup" && (
          <>
            <input
              className="input"
              placeholder="Username"
              {...register(
                "username",
                usernameRequired ? { required: "Username is required" } : {},
              )}
            />
            {errors.username && (
              <span className="text-red-500 text-sm">
                {errors.username.message}
              </span>
            )}
          </>
        )}

        <input
          type="email"
          className="input"
          placeholder="Email"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email.message}</span>
        )}

        <input
          type="password"
          className="input"
          placeholder="Password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Min length is 6" },
          })}
        />
        {errors.password && (
          <span className="text-red-500 text-sm">
            {errors.password.message}
          </span>
        )}

        {serverError && (
          <div className="text-red-600 text-sm">{serverError}</div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-full disabled:opacity-70"
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : mode === "signup"
              ? "Create account"
              : "Sign in"}
        </button>
      </form>

      <p
        className="mt-3 text-center text-sm"
        style={{ color: "var(--color-gray-blue)" }}
      >
        {mode === "signup" ? (
          <>
            Уже есть аккаунт?{" "}
            <button
              type="button"
              className="underline font-semibold text-[var(--color-deep-blue)]"
              onClick={() => setMode("signin")}
            >
              Войти
            </button>
          </>
        ) : (
          <>
            Нет аккаунта?{" "}
            <button
              type="button"
              className="underline font-semibold text-[var(--color-deep-blue)]"
              onClick={() => setMode("signup")}
            >
              Зарегистрироваться
            </button>
          </>
        )}
      </p>
    </div>
  );
}
