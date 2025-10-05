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

  // базовый класс поля ввода + подсветка ошибок
  const inputBase = "input";
  const invalid = "border-red-300 ring-2 ring-red-200 focus:ring-red-300";

  return (
    <div className="card p-6 mx-auto max-w-md">
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
        <hr className="flex-grow border-brand-light/40 dark:border-neutral-700" />
        <span className="mx-2 text-sm text-brand-gray-blue dark:text-neutral-400">
          or
        </span>
        <hr className="flex-grow border-brand-light/40 dark:border-neutral-700" />
      </div>

      {/* Форма */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {mode === "signup" && (
          <>
            <label
              htmlFor="username"
              className="text-sm font-medium text-brand-dark dark:text-brand-white"
            >
              Username
            </label>
            <input
              id="username"
              className={`${inputBase} ${errors.username ? invalid : ""}`}
              placeholder="e.g. slava_dev"
              {...register(
                "username",
                usernameRequired ? { required: "Username is required" } : {},
              )}
              disabled={loading || isSubmitting}
              autoComplete="username"
            />
            {errors.username && (
              <span className="text-sm text-red-600">
                {errors.username.message}
              </span>
            )}
          </>
        )}

        <label
          htmlFor="email"
          className="text-sm font-medium text-brand-dark dark:text-brand-white"
        >
          {mode === "signin" ? "Username" : "Email"}
        </label>
        <input
          id="email"
          type={mode === "signin" ? "text" : "email"}
          className={`${inputBase} ${errors.email ? invalid : ""}`}
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
          <span className="text-sm text-red-600">{errors.email.message}</span>
        )}

        <label
          htmlFor="password"
          className="text-sm font-medium text-brand-dark dark:text-brand-white"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          className={`${inputBase} ${errors.password ? invalid : ""}`}
          placeholder="••••••••"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Min length is 6" },
          })}
          disabled={loading || isSubmitting}
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
        />
        {errors.password && (
          <span className="text-sm text-red-600">
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
        <p className="mt-3 text-center text-sm text-brand-gray-blue dark:text-neutral-400">
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
