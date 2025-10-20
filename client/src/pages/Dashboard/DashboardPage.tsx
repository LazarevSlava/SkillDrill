import * as React from "react";
import DashboardSidebar from "./DashboardSidebar";
import ProgressOverview from "./ProgressOverview";
import SessionCard, { type SessionCardData } from "./SessionCard";

// API
import {
  fetchSessionTemplates,
  SessionTemplate,
} from "../../api/sessionTemplates";
import {
  fetchSessions,
  createSessionFromTemplate,
  startSession,
  SessionItem,
} from "../../api/sessions";
import { createUserTemplate } from "../../api/userTemplates";
import Spinner from "../../components/ui/Spinner";

// ——— вспомогательные типы/утилиты ———
type Language = "JavaScript" | "TypeScript" | "Python" | "React" | "Node.js";
type Duration = 15 | 30 | 60;

/** Сужаем произвольное число к нашему юниону 15|30|60 */
function toDuration(n: number): Duration {
  if (n <= 15) return 15;
  if (n <= 30) return 30;
  return 60;
}

/** Определяем язык по топикам */
function inferLanguageFromTopics(topics: string[] = []): Language {
  const t = topics.map((s) => s.toLowerCase());
  if (t.includes("react")) return "React";
  if (t.includes("node") || t.includes("node.js") || t.includes("nodejs"))
    return "Node.js";
  if (t.includes("typescript") || t.includes("ts")) return "TypeScript";
  if (t.includes("python")) return "Python";
  return "JavaScript";
}

/** Приводим API-статусы к твойму SessionStatus ("draft" | "scheduled" | "completed") */
function mapStatus(
  apiStatus: SessionItem["status"],
): "draft" | "scheduled" | "completed" {
  if (apiStatus === "draft") return "draft";
  if (apiStatus === "completed") return "completed";
  // всё остальное (в т.ч. "in_progress", "scheduled", "canceled") показываем как "scheduled"
  return "scheduled";
}

export default function DashboardPage() {
  // 1) counters — пока заглушка

  // 2) templates & sessions
  const [templates, setTemplates] = React.useState<SessionTemplate[]>([]);
  const [sessions, setSessions] = React.useState<SessionItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [busy, setBusy] = React.useState<string | null>(null); // id кнопки, чтобы дизейблить

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const [tplRes, sesRes] = await Promise.all([
          fetchSessionTemplates(),
          fetchSessions(),
        ]);
        if (!alive) return;
        setTemplates(tplRes.items);
        setSessions(sesRes.items);
      } catch (e) {
        console.error("[Dashboard] load error:", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // ————— handlers —————
  async function handleCreateFromTemplate(tplId: string) {
    try {
      setBusy(`tpl:${tplId}`);
      const res = await createSessionFromTemplate(tplId, "global");
      setSessions((prev) => [res.item, ...prev]);
    } finally {
      setBusy(null);
    }
  }

  // «Создать новую сессию» — MVP: создаём юзерский пресет и сразу сессию
  async function handleCreateCustom() {
    try {
      setBusy("new");
      const tpl = await createUserTemplate({
        title: `Мой пресет ${new Date().toLocaleDateString()}`,
        topics: ["js"],
        durationMin: 30,
        difficulty: "medium",
        position: "Middle",
      });
      const s = await createSessionFromTemplate(tpl.item._id, "user");
      setSessions((prev) => [s.item, ...prev]);
    } finally {
      setBusy(null);
    }
  }

  async function handleStart(sessionId: string) {
    try {
      setBusy(`start:${sessionId}`);
      await startSession(sessionId);
      // Обновим статус локально (API может вернуть что-то ещё, но для UX хватит)
      setSessions((prev) =>
        prev.map((s) =>
          s._id === sessionId ? { ...s, status: "in_progress" } : s,
        ),
      );
    } finally {
      setBusy(null);
    }
  }

  // ————— маппинги под SessionCardData —————

  function toTopics(val: unknown): string[] {
    if (Array.isArray(val)) return val.filter(Boolean).map(String);
    if (typeof val === "string" && val.trim()) {
      // поддержим строки формата "js, react typescript"
      return val.split(/[,\s]+/).filter(Boolean);
    }
    return [];
  }

  // --- sessions -> UI
  const userSessionsUI: SessionCardData[] = sessions.map(
    (s): SessionCardData => {
      const topics = toTopics(s.snapshot?.topics);
      return {
        id: s._id,
        title: s.snapshot?.title ?? "Без названия",
        language: inferLanguageFromTopics(topics),
        level: s.snapshot?.position,
        difficulty: s.snapshot?.difficulty,
        durationMin: toDuration(Number(s.snapshot?.durationMin)),
        scheduledAt: s.scheduledAt ?? undefined,
        status: mapStatus(s.status),
        tags: topics,
        isTemplate: false,
        onStart: () => handleStart(s._id),
        onEdit: () => {},
      };
    },
  );

  // --- templates -> UI
  const presetTemplatesUI: SessionCardData[] = templates.map(
    (t): SessionCardData => {
      const topics = toTopics(t?.topics);
      return {
        id: t._id,
        title: t.title ?? "Шаблон",
        language: inferLanguageFromTopics(topics),
        level: t.position,
        difficulty: t.difficulty,
        durationMin: toDuration(Number(t.durationMin)),
        scheduledAt: undefined,
        lastRunAt: undefined,
        status: "draft",
        tags: topics,
        isTemplate: true,
        onCreateFromTemplate: () => handleCreateFromTemplate(t._id),
      };
    },
  );

  return (
    <main className="min-h-screen app-bg">
      <div className="section grid grid-cols-1 md:grid-cols-[16rem,1fr] gap-6">
        <DashboardSidebar />

        <div className="flex flex-col gap-6">
          <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[color:var(--color-deep-blue)]">
                Твой дэшборд
              </h1>
              <p className="mt-1 text-[color:var(--color-gray-blue)]">
                Продолжай откуда остановился…
              </p>
            </div>
            <div className="flex gap-3">
              <button className="btn btn-outline">Смотреть прогресс</button>
              <button
                className="btn btn-primary"
                onClick={handleCreateCustom}
                disabled={busy === "new"}
              >
                {busy === "new" ? "Создаю…" : "Создать новую сессию"}
              </button>
            </div>
          </header>

          {/* counters из summary */}
          <ProgressOverview />

          {/* Твои сессии */}
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-[color:var(--color-dark-gray)]">
              Твои сессии
            </h2>
            {loading ? (
              <div className="card p-6 flex items-center gap-3">
                <Spinner /> Загрузка…
              </div>
            ) : sessions.length === 0 ? (
              <div className="card p-6 text-[color:var(--color-gray-blue)]">
                Пока нет сессий
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {userSessionsUI.map((s) => (
                  <SessionCard key={s.id} data={s} />
                ))}
              </div>
            )}
          </section>

          {/* Шаблоны */}
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-[color:var(--color-dark-gray)]">
              Быстрый старт (шаблоны)
            </h2>
            {loading ? (
              <div className="card p-6 flex items-center gap-3">
                <Spinner /> Загружаю шаблоны…
              </div>
            ) : templates.length === 0 ? (
              <div className="card p-6 text-[color:var(--color-gray-blue)]">
                Шаблонов пока нет
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {presetTemplatesUI.map((tpl) => (
                  <SessionCard key={tpl.id} data={tpl} isTemplate />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
