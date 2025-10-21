// client/src/pages/Setup/Steps/ReviewStep.tsx
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import { finalizeSetup } from "../../../features/setup/useSetupForm";

// --- режим create-session ---
import { loadNewSession, clearNewSession } from "../newSessionStorage";
import { createSession } from "../../../api/sessions";
import type { NewSessionData } from "../newSessionStorage";

// Тип, чтобы явно контролировать поведение
type Props = {
  mode?: "onboarding" | "create-session";
};

export default function ReviewStep({ mode = "onboarding" }: Props) {
  return mode === "create-session" ? (
    <CreateSessionReview />
  ) : (
    <OnboardingReview />
  );
}

/* ===========================
   РЕЖИМ: ONBOARDING (/setup/*)
   — внутри есть FormProvider, поэтому используем useFormContext
================================ */
import { useFormContext } from "react-hook-form";
import type { SetupFormInput } from "../../../features/setup/useSetupForm";

function OnboardingReview() {
  const { getValues, handleSubmit } = useFormContext<SetupFormInput>();
  const nav = useNavigate();

  const v = getValues(); // снимок текущих значений формы

  const onSubmit = handleSubmit(() => {
    finalizeSetup();
    nav("/dashboard");
  });

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <h2 className="text-lg md:text-xl font-semibold text-brand-deep dark:text-brand-white">
        Проверь настройки
      </h2>

      <DetailsList
        topics={v.topics}
        duration={v.duration}
        level={v.level}
        position={v.position}
        tone={v.tone}
        focus={v.focus}
        voice={v.voice}
      />

      <div className="flex justify-between">
        <Link to="/setup/preferences" className="btn btn-outline">
          ← Назад
        </Link>

        <Button type="submit" variant="primary">
          Сохранить и продолжить → /dashboard
        </Button>
      </div>
    </form>
  );
}

/* ===========================
   РЕЖИМ: CREATE SESSION (/sessions/new/*)
   — FormProvider может отсутствовать, поэтому НЕЛЬЗЯ звать useFormContext
   — источник данных: newSessionStorage
================================ */
type Duration = 15 | 30 | 60;
const toDuration = (n: number): Duration => (n <= 15 ? 15 : n <= 30 ? 30 : 60);

const NEW_SESSION_DEFAULTS: NewSessionData = {
  title: "",
  topics: [],
  duration: 30,
  level: "medium",
  position: "Junior",
  preferences: {},
};

function CreateSessionReview() {
  const nav = useNavigate();
  const [submitting, setSubmitting] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const payload: NewSessionData = loadNewSession() ?? NEW_SESSION_DEFAULTS;

  // Приводим значения и выставляем дефолты, чтобы не ломать строгие типы API
  const {
    title,
    topics,
    duration,
    level,
    position,
    preferences = {},
  } = payload;

  const safePosition: "Junior" | "Middle" | "Senior" = position ?? "Junior";

  const canSubmit =
    title.trim().length > 0 &&
    Array.isArray(topics) &&
    topics.length > 0 &&
    Number(duration) > 0;

  const handleCreate = async () => {
    setErr(null);
    if (!canSubmit) {
      setErr("Заполни минимум: темы, длительность и название.");
      return;
    }
    try {
      setSubmitting(true);
      await createSession({
        title: title.trim(),
        topics,
        duration: toDuration(Number(duration)),
        level,
        position: safePosition,
        preferences,
      });
      clearNewSession();
      nav("/dashboard");
    } catch {
      setErr("Не удалось создать сессию. Повтори попытку.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg md:text-xl font-semibold text-brand-deep dark:text-brand-white">
        Проверь настройки новой сессии
      </h2>

      <DetailsList
        title={title}
        topics={topics}
        duration={duration}
        level={level}
        position={position}
      />

      {err && (
        <div className="card p-3 text-sm text-red-700 bg-red-50 border border-red-200">
          {err}
        </div>
      )}

      <div className="flex justify-between">
        <Link to="/sessions/new/preferences" className="btn btn-outline">
          ← Назад
        </Link>

        <Button
          type="button"
          variant="primary"
          onClick={handleCreate}
          disabled={!canSubmit || submitting}
        >
          {submitting ? "Создаю…" : "Создать сессию → /dashboard"}
        </Button>
      </div>
    </div>
  );
}

/* ===========================
   Общий рендер списком деталей
================================ */
type DetailsProps = {
  title?: string;
  topics?: string[];
  duration?: number;
  level?: string;
  position?: string;
  tone?: string;
  focus?: string;
  voice?: boolean;
};

function DetailsList({
  title,
  topics,
  duration,
  level,
  position,
  tone,
  focus,
  voice,
}: DetailsProps) {
  const dash = "—";
  return (
    <ul className="text-sm text-brand-dark dark:text-neutral-300 space-y-1">
      {title !== undefined && (
        <li>
          <b>Название:</b> {title || dash}
        </li>
      )}
      <li>
        <b>Темы:</b> {topics?.length ? topics.join(", ") : dash}
      </li>
      <li>
        <b>Длительность:</b> {duration ? `${duration} мин` : dash}
      </li>
      <li>
        <b>Сложность:</b> {level || dash}
      </li>
      <li>
        <b>Позиция:</b> {position || dash}
      </li>
      {tone !== undefined && (
        <li>
          <b>Обращение:</b> {tone || dash}
        </li>
      )}
      {focus !== undefined && (
        <li>
          <b>Акцент:</b> {focus || dash}
        </li>
      )}
      {voice !== undefined && (
        <li>
          <b>Голос:</b> {voice ? "включён" : "выключен"}
        </li>
      )}
    </ul>
  );
}
