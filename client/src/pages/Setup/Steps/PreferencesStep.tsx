// client/src/pages/Setup/Steps/PreferencesStep.tsx
import { useSetupForm } from "../../../features/setup/useSetupForm";
import { Link } from "react-router-dom";

const tones = ["ty", "vy"] as const;
const focuses = ["algorithms", "system", "frameworks"] as const;

export default function PreferencesStep() {
  const { values, update } = useSetupForm();

  return (
    <div className="space-y-6">
      <section>
        <div className="mb-2 font-medium">Обращение</div>
        <Row
          options={tones}
          value={values.tone}
          onSelect={(v) => update("tone", v)}
        />
      </section>

      <section>
        <div className="mb-2 font-medium">Акцент</div>
        <Row
          options={focuses}
          value={values.focus}
          onSelect={(v) => update("focus", v)}
        />
      </section>

      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          checked={values.voice}
          onChange={(e) => update("voice", e.target.checked)}
        />
        <span>Голос + текст</span>
      </label>

      <div className="flex justify-between">
        <Link to="/setup/session" className="px-4 py-2 rounded-lg border">
          Назад
        </Link>
        <Link to="/setup/review" className="px-4 py-2 rounded-lg border">
          Далее
        </Link>
      </div>
    </div>
  );
}

function Row<T extends string>({
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
          key={o}
          onClick={() => onSelect(o)}
          className={`px-3 py-1 rounded-2xl border ${o === value ? "bg-blue-50" : ""}`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
