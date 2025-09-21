import { Link } from "react-router-dom";
import { Topic } from "../../../features/setup/types";
import { useSetupForm } from "../../../features/setup/useSetupForm";

const all: Topic[] = ["javascript", "react", "python", "node"];

export default function TopicsStep() {
  const { values, update } = useSetupForm();
  function toogle(t: Topic) {
    const has = values.topics.includes(t);
    update(
      "topics",
      has ? values.topics.filter((x) => x !== t) : [...values.topics, t],
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Выбери темы — можно несколько.</p>
      <div className="flex flex-wrap gap-2">
        {all.map((t) => (
          <button
            key={t}
            onClick={() => toogle(t)}
            className={`px-3 py-1 rounded-2xl border ${
              values.topics.includes(t) ? "bg-yellow-100 border-yellow-400" : ""
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <Link to="/setup/session" className="px-4 py-2 rounded-lg border">
          Далее
        </Link>
      </div>
    </div>
  );
}
