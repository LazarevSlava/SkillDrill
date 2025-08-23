import { useForm } from "react-hook-form";
import { useState } from "react";

type FormValues = {
  email: string;
  password: string;
  username?: string;
};

export default function RegisterForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signup");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    console.log(`${mode.toUpperCase()} DATA:`, data);
  };

  const handleOAuth = (provider: string) => {
    console.log(`Redirect to ${provider} OAuth`);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-card text-fg rounded-2xl shadow-md border">
      {/* Segmented control */}
      <div className="flex justify-center mb-6">
        <button
          type="button"
          className={[
            "px-4 py-2 rounded-l-lg border transition",
            mode === "signin"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-muted text-fg/80 hover:bg-muted/80",
          ].join(" ")}
          onClick={() => setMode("signin")}
        >
          Sign In
        </button>
        <button
          type="button"
          className={[
            "px-4 py-2 rounded-r-lg border -ml-px transition",
            mode === "signup"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-muted text-fg/80 hover:bg-muted/80",
          ].join(" ")}
          onClick={() => setMode("signup")}
        >
          Sign Up
        </button>
      </div>

      {/* OAuth */}
      <div className="flex flex-col gap-3 mb-6">
        <button
          type="button"
          onClick={() => handleOAuth("google")}
          className="py-2 px-4 border rounded-lg bg-bg hover:bg-muted transition text-fg"
        >
          Continue with Google
        </button>
        <button
          type="button"
          onClick={() => handleOAuth("github")}
          className="py-2 px-4 border rounded-lg bg-bg hover:bg-muted transition text-fg"
        >
          Continue with GitHub
        </button>
        <button
          type="button"
          onClick={() => handleOAuth("apple")}
          className="py-2 px-4 border rounded-lg bg-bg hover:bg-muted transition text-fg"
        >
          Continue with Apple
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center my-4">
        <hr className="flex-grow border-border" />
        <span className="mx-2 text-fg/60">or</span>
        <hr className="flex-grow border-border" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
            className="w-full border bg-bg text-fg placeholder:text-fg/60 px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
          {errors.email && (
            <span className="text-destructive text-sm mt-1 block">
              {errors.email.message}
            </span>
          )}
        </div>

        {mode === "signup" && (
          <div>
            <input
              type="text"
              placeholder="Username"
              {...register("username")}
              className="w-full border bg-bg text-fg placeholder:text-fg/60 px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>
        )}

        <div>
          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
            className="w-full border bg-bg text-fg placeholder:text-fg/60 px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
          {errors.password && (
            <span className="text-destructive text-sm mt-1 block">
              {errors.password.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition focus:ring-2 focus:ring-primary/30"
        >
          {mode === "signup" ? "Sign Up" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
