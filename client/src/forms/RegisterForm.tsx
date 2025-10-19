// src/forms/RegisterForm.tsx
import { useRegister } from "../hooks/useRegister";
import type { Mode } from "../shared/authTypes";
import Button from "../components/ui/Button";

export type RegisterFormProps = {
  mode?: Mode;
  onSuccess?: () => void; // если не задан, useRegister решит сам
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
    onSubmit, // ← используем только это, НИКАКИХ локальных apiLogin
  } = useRegister({ initialMode, onSuccess, stub });

  const isSignin = mode === "signin";

  const inputBase = "input";
  const invalid = "border-red-300 ring-2 ring-red-200 focus:ring-red-300";

  return (
    <div className="card p-6 mx-auto max-w-md">
      {/* Переключатель режимов */}
      <div className="mb-6 flex justify-center">
        <Button
          type="button"
          variant={isSignin ? "brand" : "outline"}
          className="rounded-r-none"
          onClick={() => setMode("signin")}
          aria-pressed={isSignin}
          disabled={loading || isSubmitting}
        >
          Sign In
        </Button>
        <Button
          type="button"
          variant={!isSignin ? "brand" : "outline"}
          className="rounded-l-none"
          onClick={() => setMode("signup")}
          aria-pressed={!isSignin}
          disabled={loading || isSubmitting}
        >
          Sign Up
        </Button>
      </div>

      {/* Соц-заглушки */}
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

      {/* Форма — только handleSubmit(onSubmit) */}
      <form
        onSubmit={handleSubmit((vals) => {
          return onSubmit(vals); // пробрасываем как было
        })}
        className="flex flex-col gap-3"
      >
        {" "}
        {/* В signup дополнительно спрашиваем Username */}
        {!isSignin && (
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
                {errors.username.message as string}
              </span>
            )}
          </>
        )}
        {/* В signin поле ввода остаётся 'email' по типам формы,
            но useRegister сам соберёт name = username ?? email */}
        <label
          htmlFor="emailOrName"
          className="text-sm font-medium text-brand-dark dark:text-brand-white"
        >
          {isSignin ? "Username" : "Email"}
        </label>
        <input
          id="emailOrName"
          type={isSignin ? "text" : "email"}
          className={`${inputBase} ${errors.email ? invalid : ""}`}
          placeholder={isSignin ? "your_username" : "you@example.com"}
          {...register("email", {
            required: isSignin ? "Username is required" : "Email is required",
            ...(isSignin
              ? {}
              : {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                }),
          })}
          disabled={loading || isSubmitting}
          autoComplete={isSignin ? "username" : "email"}
        />
        {errors.email && (
          <span className="text-sm text-red-600">
            {errors.email.message as string}
          </span>
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
          autoComplete={isSignin ? "current-password" : "new-password"}
        />
        {errors.password && (
          <span className="text-sm text-red-600">
            {errors.password.message as string}
          </span>
        )}
        {serverError && (
          <div className="text-sm text-red-600" role="alert" aria-live="polite">
            {serverError}
          </div>
        )}
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={loading || isSubmitting}
          isLoading={loading || isSubmitting}
        >
          {isSignin ? "Sign in" : "Create account"}
        </Button>
      </form>

      {showBottomToggle && (
        <p className="mt-3 text-center text-sm text-brand-gray-blue dark:text-neutral-400">
          {!isSignin ? (
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
