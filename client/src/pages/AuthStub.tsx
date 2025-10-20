// client/src/pages/AuthStub.tsx
import { useParams, Link, useNavigate } from "react-router-dom";
import Section from "../components/ui/Section";
import { useState } from "react";
import { apiLogin } from "../shared/authApi";

export default function AuthStub() {
  const navigate = useNavigate();
  const { mode: rawMode } = useParams();
  const mode = (rawMode ?? "").toLowerCase(); // на всякий случай
  const isLogin = mode === "login";
  const title = isLogin ? "Вход (заглушка)" : "Регистрация (заглушка)";

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr(null);

    // запасной путь: вдруг где-то что-то не так с состоянием — считаем напрямую из DOM
    const fd = new FormData(e.currentTarget);
    const domName = (fd.get("name") as string | null)?.trim() ?? "";
    const domPassword = (fd.get("password") as string | null) ?? "";

    const finalName = (name || domName).trim(); // приоритет — state, но fallback — DOM
    const finalPassword = password || domPassword;

    console.log("LOGIN_FORM_DATA", { finalName, finalPassword });

    if (!finalName || !finalPassword) {
      setErr("Укажите логин и пароль");
      return;
    }

    try {
      setBusy(true);
      const res = await apiLogin({ name: finalName, password: finalPassword });
      console.log("LOGIN_OK", res);

      navigate("/dashboard", { replace: true });
    } catch (e: unknown) {
      console.error("LOGIN_FAIL", e);
      const msg =
        e instanceof Error
          ? e.message
          : typeof e === "string"
            ? e
            : "login_failed";
      setErr(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section className="max-w-xl text-center space-y-6">
      <h1 className="text-3xl font-bold text-brand-deep dark:text-brand-white">
        {title}
      </h1>

      {isLogin ? (
        <form
          onSubmit={onSubmit}
          className="mx-auto grid gap-3 text-left max-w-sm"
        >
          <label className="grid gap-1">
            <span className="text-sm text-brand-gray-blue">Логин (name)</span>
            <input
              name="name" // важно!
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="username"
              className="input"
              placeholder="например, slava"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-brand-gray-blue">Пароль</span>
            <input
              name="password" // важно!
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="input"
            />
          </label>

          {err && <p className="text-red-600 text-sm">{err}</p>}

          <button
            className="btn btn-primary mt-2"
            type="submit"
            disabled={busy}
          >
            {busy ? "Входим…" : "Войти"}
          </button>
        </form>
      ) : (
        <>
          <p className="mt-2 text-brand-gray-blue dark:text-neutral-400">
            Здесь будет настоящая форма. Пока можно перейти в личный кабинет.
          </p>
          <Link to="/dashboard" className="btn btn-primary mt-2 inline-block">
            Перейти в /dashboard
          </Link>
        </>
      )}
    </Section>
  );
}
