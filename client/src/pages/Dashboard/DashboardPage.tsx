import DashboardSidebar from "./DashboardSidebar";
import ProgressOverview from "./ProgressOverview";
import SessionCard from "./SessionCard";
import { presetTemplates, userSessions } from "./mockData";
import Spinner from "../../components/ui/Spinner";

export default function DashboardPage() {
  const loading = false;

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
                Продолжай откуда остановился, запускай новые сессии и следи за
                прогрессом.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="btn btn-outline">Смотреть прогресс</button>
              <button className="btn btn-primary">Создать новую сессию</button>
            </div>
          </header>

          <ProgressOverview />

          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-[color:var(--color-dark-gray)]">
              Твои сессии
            </h2>
            {loading ? (
              <div className="card p-6 flex items-center gap-3">
                <Spinner /> Загрузка…
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {userSessions.map((s) => (
                  <SessionCard key={s.id} data={s} />
                ))}
              </div>
            )}
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-[color:var(--color-dark-gray)]">
              Быстрый старт (шаблоны)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {presetTemplates.map((tpl) => (
                <SessionCard key={tpl.id} data={tpl} isTemplate />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
