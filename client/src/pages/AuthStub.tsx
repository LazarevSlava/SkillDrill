// client/src/pages/AuthStub.tsx
import { useParams, Link } from "react-router-dom";
import Section from "../components/ui/Section";

export default function AuthStub() {
  const { mode } = useParams();
  const title = mode === "login" ? "Вход (заглушка)" : "Регистрация (заглушка)";

  return (
    <Section className="max-w-xl text-center">
      <h1 className="text-3xl font-bold text-brand-deep dark:text-brand-white">
        {title}
      </h1>

      <p className="mt-2 text-brand-gray-blue dark:text-neutral-400">
        Здесь будет настоящая форма. Пока можно перейти в личный кабинет.
      </p>

      <Link to="/dashboard" className="btn btn-primary mt-6 inline-block">
        Перейти в /dashboard
      </Link>
    </Section>
  );
}
