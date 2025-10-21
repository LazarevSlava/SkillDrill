// client/src/pages/Setup/Steps/ReviewStep.tsx
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import { finalizeSetup } from "../../../features/setup/useSetupForm";

// --- режим create-session ---
import {
  loadNewSession,
  saveNewSession,
  clearNewSession,
} from "../newSessionStorage";

// API: создаём юзер-шаблон, затем сессию из него
import { createUserTemplate } from "../../../api/userTemplates";
import { createSessionFromTemplate } from "../../../api/sessions";

import { useFormContext } from "react-hook-form";
import type { NewSessionData } from "../newSessionStorage";
import type { SetupFormInput } from "../../../features/setup/useSetupForm";

/* ===========================
   Пропс режима
================================ */
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
   ONBOARDING (/setup/*)
================================ */
function OnboardingReview() {
  const { getValues, handleSubmit } = useFormContext<SetupFormInput>();
  const nav = useNavigate();

  const v = getValues();

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
   CREATE SESSION (/sessions/new/*)
================================ */
type Duration = 15 | 30 | 60;
const toDuration = (n: number): Duration => (n <= 15 ? 15 : n <= 30 ? 30 : 60);

// ---- нормализации и типы ----
function normalizePosition(p: unknown): "Junior" | "Middle" | "Senior" {
  const s = String(p || "").toLowerCase();
  if (s === "junior") return "Junior";
  if (s === "senior") return "Senior";
  return "Middle";
}

const TOPIC_CANON: Record<string, string> = {
  javascript: "JavaScript",
  js: "JavaScript",
  typescript: "TypeScript",
  ts: "TypeScript",
  python: "Python",
  react: "React",
  "node.js": "Node.js",
  nodejs: "Node.js",
  node: "Node.js",
};

function normalizeTopic(t: unknown): string | null {
  if (typeof t !== "string") return null;
  const raw = t.trim();
  if (!raw) return null;
  const key = raw.toLowerCase();
  return TOPIC_CANON[key] ?? raw[0].toUpperCase() + raw.slice(1);
}

function cleanTopics(topics: unknown): string[] {
  if (!Array.isArray(topics)) return [];
  const canon = topics
    .map(normalizeTopic)
    .filter((x): x is string => Boolean(x));
  return Array.from(new Set(canon));
}

function normalizeLevel(lvl: unknown): "easy" | "medium" | "hard" {
  const s = String(lvl || "").toLowerCase();
  return s === "easy" || s === "hard" ? (s as "easy" | "hard") : "medium";
}

function isEmptyObject(o: unknown): boolean {
  return (
    !!o &&
    typeof o === "object" &&
    Object.keys(o as Record<string, unknown>).length === 0
  );
}

// контракт user-template
type CreateUserTemplateBody = {
  title: string;
  topics: string[];
  durationMin: 15 | 30 | 60;
  difficulty: "easy" | "medium" | "hard";
  position: "Junior" | "Middle" | "Senior";
  meta?: Record<string, unknown>;
};

type CreateUserTemplateResponse = {
  item: { _id: string };
};

// безопасный разбор ошибок API без any
type ApiErrorLike = {
  message?: string;
  data?: { error?: string; message?: string };
  response?: { data?: { error?: string; message?: string } };
};

function getApiMessage(err: unknown): string {
  const e = err as ApiErrorLike | undefined;
  return (
    e?.message ??
    e?.data?.error ??
    e?.response?.data?.error ??
    e?.response?.data?.message ??
    "Не удалось выполнить запрос."
  );
}

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

  const {
    title: storedTitle,
    topics,
    duration,
    level,
    position,
    preferences = {},
  } = payload;

  const topicsCanon = cleanTopics(topics);
  const durationClean = toDuration(Number(duration));
  const levelClean = normalizeLevel(level);
  const safePosition: "Junior" | "Middle" | "Senior" =
    normalizePosition(position);

  // автотайтл из канонических тем/параметров
  const autoTitle = React.useMemo(() => {
    const t = topicsCanon.length ? topicsCanon.join(" / ") : "Custom";
    const dur = durationClean || 30;
    const lvl = levelClean;
    const pos = safePosition;
    return `${t} • ${dur} мин • ${lvl} • ${pos}`;
  }, [topicsCanon, durationClean, levelClean, safePosition]);

  const [title, setTitle] = React.useState<string>(
    (storedTitle || "").trim() || autoTitle,
  );

  React.useEffect(() => {
    if (!storedTitle || storedTitle.trim().length === 0) {
      setTitle(autoTitle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoTitle]);

  React.useEffect(() => {
    saveNewSession({ title });
  }, [title]);

  const canSubmit = topicsCanon.length > 0 && Boolean(durationClean);
  const computedTitle = (title || "").trim() || autoTitle;

  const handleCreate = async () => {
    setErr(null);

    if (!canSubmit) {
      setErr("Заполни минимум: темы и длительность.");
      return;
    }

    // 1) создаём пользовательский шаблон
    const templateBody: CreateUserTemplateBody = {
      title: computedTitle,
      topics: topicsCanon,
      durationMin: durationClean,
      difficulty: levelClean,
      position: safePosition,
      ...(preferences && !isEmptyObject(preferences)
        ? { meta: preferences as Record<string, unknown> }
        : {}),
    };

    try {
      setSubmitting(true);

      const tplUnknown = await createUserTemplate(templateBody);
      const tplRes = tplUnknown as unknown as CreateUserTemplateResponse;

      const templateId = tplRes?.item?._id;
      if (!templateId) {
        throw new Error("Не удалось создать шаблон (пустой templateId).");
      }

      // 2) создаём сессию из пользовательского шаблона
      await createSessionFromTemplate(templateId, "user");

      clearNewSession();
      nav("/dashboard");
    } catch (e: unknown) {
      setErr(getApiMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg md:text-xl font-semibold text-brand-deep dark:text-brand-white">
        Проверь настройки новой сессии
      </h2>

      {/* Редактируемое название */}
      <div className="grid gap-2">
        <label className="text-sm text-brand-dark dark:text-neutral-300">
          Название сессии
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Например: Python / React • 30 мин • medium • Middle"
          className="w-full rounded-lg border border-brand-light bg-white/60 px-3 py-2
                     focus:outline-none focus:ring-2 focus:ring-brand-light
                     dark:bg-neutral-900 dark:border-neutral-700"
        />
      </div>

      <DetailsList
        title={computedTitle}
        topics={topicsCanon}
        duration={durationClean}
        level={levelClean}
        position={safePosition}
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
