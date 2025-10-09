import StatusBadge from "./StatusBadge";
import { formatDate } from "./helpers";
import type { Session } from "./helpers";

export default function SessionCard({
  data,
  isTemplate = false,
}: {
  data: Session;
  isTemplate?: boolean;
}) {
  return (
    <div className="card p-5 flex flex-col gap-4 h-full">
      {/* верх: заголовок + статус фиксированного размера, чтобы не прыгал */}
      <div className="flex items-start justify-between gap-3 min-h-[2.25rem]">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-[color:var(--color-deep-blue)] truncate">
            {data.title}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[color:var(--color-gray-blue)]">
            <span className="badge">{data.language}</span>
            <span className="badge">Уровень: {data.level}</span>
            <span className="badge">Сложность: {data.difficulty}</span>
            <span className="badge">{data.durationMin} мин</span>
          </div>
        </div>
        {!isTemplate && (
          <div className="shrink-0">
            <StatusBadge status={data.status} />
          </div>
        )}
      </div>

      {/* середина: мета-инфо одинаковой высоты */}
      <div className="text-sm text-[color:var(--color-gray-blue)] min-h-[2.5rem]">
        {data.status === "scheduled" && (
          <p>
            Начало:{" "}
            <b className="text-[color:var(--color-dark-gray)]">
              {formatDate(data.scheduledAt)}
            </b>
          </p>
        )}
        {data.status === "completed" && (
          <p>
            Последний запуск:{" "}
            <b className="text-[color:var(--color-dark-gray)]">
              {formatDate(data.lastRunAt)}
            </b>
          </p>
        )}
      </div>

      {/* низ: всегда две колонки, кнопки одинаковой ширины */}
      <div
        className={`mt-auto grid gap-3 ${isTemplate ? "grid-cols-1" : "grid-cols-2"}`}
      >
        {isTemplate ? (
          <>
            <button className="btn btn-primary w-full leading-tight">
              Создать из шаблона
            </button>
            <button className="btn btn-outline w-full">Предпросмотр</button>
          </>
        ) : (
          <>
            <button className="btn btn-primary w-full">Запустить</button>
            <button className="btn btn-outline w-full">Редактировать</button>
          </>
        )}
      </div>
    </div>
  );
}
