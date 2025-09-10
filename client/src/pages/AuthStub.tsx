import { useParams, Link } from "react-router-dom";

export default function AuthStub() {
  const { mode } = useParams(); // "login" | "signup"
  const title = mode === "login" ? "Вход (заглушка)" : "Регистрация (заглушка)";

  return (
    <div className="min-h-screen bg-[var(--color-white)]">
      <div className="section text-center">
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--color-deep-blue)" }}
        >
          {title}
        </h1>
        <p className="mt-2" style={{ color: "var(--color-gray-blue)" }}>
          Здесь будет настоящая форма. Пока можно перейти в личный кабинет.
        </p>
        <Link to="/app" className="btn btn-primary mt-6 inline-block">
          Перейти в /app
        </Link>
      </div>
    </div>
  );
}
