import { useSetupForm } from "../../../features/setup/useSetupForm";
import { Link } from "react-router-dom";

const durations = [15, 30, 60] as const;
const levels = ["easy", "medium", "hard"] as const;
const positions = ["junior", "middle", "senior"] as const;

export default function SessionStep() {
  const { values, update } = useSetupForm();

  return (
    <div className="space-y-6">
      <Field title="Длительность">
        <Row
          options={durations}
          value={values.duration}
          onSelect={(v) => update("duration", v)}
        />
      </Field>

      <Field title="Сложность">
        <Row
          options={levels}
          value={values.level}
          onSelect={(v) => update("level", v)}
        />
      </Field>

      <Field title="Позиция">
        <Row
          options={positions}
          value={values.position}
          onSelect={(v) => update("position", v)}
        />
      </Field>

      <div className="flex justify-between">
        <Link to="/setup/topics" className="px-4 py-2 rounded-lg border">
          Назад
        </Link>
        <Link to="/setup/preferences" className="px-4 py-2 rounded-lg border">
          Далее
        </Link>
      </div>
    </div>
  );
}

function Field({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 font-medium">{title}</div>
      {children}
    </div>
  );
}

function Row<T extends string | number>({
  options,
  value,
  onSelect,
}: {
  options: readonly T[];
  value: T;
  onSelect: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={String(o)}
          onClick={() => onSelect(o)}
          className={`px-3 py-1 rounded-2xl border ${o === value ? "bg-blue-50" : ""}`}
        >
          {String(o)}
        </button>
      ))}
    </div>
  );
}
