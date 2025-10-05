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
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-[color:var(--color-deep-blue)]">
            {data.title}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[color:var(--color-gray-blue)]">
            <span className="badge">{data.language}</span>
            <span className="badge">Уровень: {data.level}</span>
            <span className="badge">Сложность: {data.difficulty}</span>
            <span className="badge">{data.durationMin} мин</span>
          </div>
        </div>
        {!isTemplate && <StatusBadge status={data.status} />}
      </div>

      <div className="text-sm text-[color:var(--color-gray-blue)]">
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

      <div className="mt-auto flex items-center gap-3">
        {isTemplate ? (
          <>
            <button className="btn btn-primary">Создать из шаблона</button>
            <button className="btn btn-outline">Предпросмотр</button>
          </>
        ) : (
          <>
            <button className="btn btn-primary">Запустить</button>
            <button className="btn btn-outline">Редактировать</button>
          </>
        )}
      </div>
    </div>
  );
}
