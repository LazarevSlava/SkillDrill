// src/forms/RegisterForm.tsx
import { useRegister } from "../hooks/useRegister";
import type { Mode } from "../shared/authTypes";
import Button from "../components/ui/Button";

export type RegisterFormProps = {
  mode?: Mode;
  onSuccess?: () => void; // если не задан, делаем navigate('/setup')
  stub?: "off" | "always" | "fallback";
  showBottomToggle?: boolean; // по умолчанию false
};

export default function RegisterForm({
  mode: initialMode = "signup",
  onSuccess,
  stub,
  showBottomToggle = false,
}: RegisterFormProps) {
  const {
    mode,
    setMode,
    serverError,
    loading,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    usernameRequired,
    onSubmit,
  } = useRegister({ initialMode, onSuccess, stub });

  const inputClass =
    "w-full rounded-xl border px-4 py-2 outline-none " +
    "border-[color:var(--color-light-blue)] " +
    "focus:ring-2 focus:ring-[color:var(--color-yellow)] " +
    "bg-[color:var(--color-white)] text-[color:var(--color-dark-gray)] " +
    "placeholder:text-[color:var(--color-gray-blue)]/70";

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-[color:var(--color-white)] p-6 shadow-md">
      {/* Верхний переключатель режимов */}
      <div className="mb-6 flex justify-center">
        <Button
          type="button"
          variant={mode === "signin" ? "brand" : "outline"}
          className="rounded-r-none"
          onClick={() => setMode("signin")}
          aria-pressed={mode === "signin"}
          disabled={loading || isSubmitting}
        >
          Sign In
        </Button>
        <Button
          type="button"
          variant={mode === "signup" ? "brand" : "outline"}
          className="rounded-l-none"
          onClick={() => setMode("signup")}
          aria-pressed={mode === "signup"}
          disabled={loading || isSubmitting}
        >
          Sign Up
        </Button>
      </div>

      {/* Соц-кнопки (заглушки) */}
      <div className="mb-6 flex flex-col gap-3">
        <Button type="button" variant="outline" disabled className="w-full">
          Continue with Google
        </Button>
        <Button type="button" variant="outline" disabled className="w-full">
          Continue with GitHub
        </Button>
        <Button type="button" variant="outline" disabled className="w-full">
          Continue with Apple
        </Button>
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
            ...(mode === "signup"
              ? {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                }
              : {}),
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

        <Button
          type="submit"
          variant="primary" // жёлтый CTA
          className="w-full"
          disabled={loading || isSubmitting}
          isLoading={loading || isSubmitting}
        >
          {mode === "signup" ? "Create account" : "Sign in"}
        </Button>
      </form>

      {/* Нижний переключатель — опционально */}
      {showBottomToggle && (
        <p className="mt-3 text-center text-sm text-[color:var(--color-gray-blue)]">
          {mode === "signup" ? (
            <>
              Уже есть аккаунт?{" "}
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={() => setMode("signin")}
                disabled={loading || isSubmitting}
                className="align-baseline"
              >
                Войти
              </Button>
            </>
          ) : (
            <>
              Нет аккаунта?{" "}
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={() => setMode("signup")}
                disabled={loading || isSubmitting}
                className="align-baseline"
              >
                Зарегистрироваться
              </Button>
            </>
          )}
        </p>
      )}
    </div>
  );
}
