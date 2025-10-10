import * as React from "react";
import { API_BASE } from "../../shared/env";

type Stat = { label: string; value: number };

// Описываем структуру данных, которую возвращает /dashboard/summary
interface DashboardSummaryResponse {
  totals?: {
    all?: number;
    completed?: number;
    in_progress?: number;
    scheduled?: number;
  };
}

export default function ProgressOverview() {
  const [stats, setStats] = React.useState<Stat[]>([
    { label: "Всего сессий", value: 0 },
    { label: "Завершено", value: 0 },
    { label: "В процессе", value: 0 },
    { label: "Запланировано", value: 0 },
  ]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/dashboard/summary`, {
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: DashboardSummaryResponse = await res.json();
        if (!alive) return;

        const t = data.totals ?? {};
        setStats([
          { label: "Всего сессий", value: t.all ?? 0 },
          { label: "Завершено", value: t.completed ?? 0 },
          { label: "В процессе", value: t.in_progress ?? 0 },
          { label: "Запланировано", value: t.scheduled ?? 0 },
        ]);
        setError(null);
      } catch (e: unknown) {
        const message =
          e instanceof Error
            ? e.message
            : typeof e === "string"
              ? e
              : "Ошибка загрузки";
        if (alive) setError(message);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="card p-4">
          <div className="text-sm text-[color:var(--color-gray-blue)]">
            {s.label}
          </div>
          <div className="mt-1 text-2xl font-extrabold text-[color:var(--color-dark-gray)]">
            {loading ? "—" : s.value}
          </div>
        </div>
      ))}

      {/* Сообщение об ошибке (если есть) */}
      {error && (
        <div className="col-span-full text-sm text-red-600">
          Не удалось загрузить счётчики: {error}
        </div>
      )}
    </div>
  );
}
