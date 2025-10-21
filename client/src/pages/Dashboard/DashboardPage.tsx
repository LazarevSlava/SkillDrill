import * as React from "react";
import { useNavigate } from "react-router-dom";

import DashboardSidebar from "./DashboardSidebar";
import ProgressOverview from "./ProgressOverview";
import SessionCard from "./SessionCard";
import Spinner from "../../components/ui/Spinner";

import DashboardHeader from "./DashboardHeader";
import { useDashboardData } from "../../hooks/useDashboardData";
import {
  mapSessionsToUI,
  mapTemplatesToUI,
} from "../../pages/Dashboard/selectors/toSessionCardData";

export default function DashboardPage() {
  const navigate = useNavigate();

  const {
    templates,
    sessions,
    loading,
    busy,
    handleCreateFromTemplate,
    // handleCreateCustom, // больше не используем
    handleStart,
  } = useDashboardData();

  const userSessionsUI = React.useMemo(
    () => mapSessionsToUI(sessions, { onStart: handleStart }),
    [sessions, handleStart],
  );

  const presetTemplatesUI = React.useMemo(
    () =>
      mapTemplatesToUI(templates, {
        onCreateFromTemplate: handleCreateFromTemplate,
      }),
    [templates, handleCreateFromTemplate],
  );

  return (
    <main className="min-h-screen app-bg">
      <div className="section grid grid-cols-1 md:grid-cols-[16rem,1fr] gap-6">
        <DashboardSidebar />

        <div className="flex flex-col gap-6">
          <DashboardHeader
            creatingNew={busy === "new"}
            onCreateNew={() => navigate("/sessions/new/topics")}
          />

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
