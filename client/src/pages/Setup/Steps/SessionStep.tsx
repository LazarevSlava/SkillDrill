import { useFormContext } from "react-hook-form";
import { useNavigate, Link, useOutletContext } from "react-router-dom";
import type { SetupForm } from "../../../features/setup/useSetupForm";
import {
  DURATIONS,
  LEVELS,
  POSITIONS,
} from "../../../features/setup/useSetupForm";

type Ctx = { go: (to: string) => void };

export default function SessionStep() {
  const { register, trigger } = useFormContext<SetupForm>();
  const nav = useNavigate();
  const { go } = useOutletContext<Ctx>();

  async function next() {
    const ok = await trigger(["duration", "level", "position"]);
    if (ok) (go ?? nav)("/setup/preferences");
  }

  return (
    <form
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
        void next();
      }}
    >
      <section className="grid gap-6 md:grid-cols-3">
        {/* duration */}
        <div>
          <div className="mb-2 font-medium">Длительность</div>
          <div className="flex flex-wrap gap-2">
            {DURATIONS.map((d) => (
              <label
                key={d}
                className="px-3 py-1 rounded-2xl border cursor-pointer"
              >
                <input
                  type="radio"
                  value={d}
                  {...register("duration")}
                  className="mr-2"
                />
                {d} мин
              </label>
            ))}
          </div>
        </div>

        {/* level */}
        <div>
          <div className="mb-2 font-medium">Сложность</div>
          <div className="flex flex-wrap gap-2">
            {LEVELS.map((l) => (
              <label
                key={l}
                className="px-3 py-1 rounded-2xl border cursor-pointer"
              >
                <input
                  type="radio"
                  value={l}
                  {...register("level")}
                  className="mr-2"
                />
                {l}
              </label>
            ))}
          </div>
        </div>

        {/* position */}
        <div>
          <div className="mb-2 font-medium">Позиция</div>
          <div className="flex flex-wrap gap-2">
            {POSITIONS.map((p) => (
              <label
                key={p}
                className="px-3 py-1 rounded-2xl border cursor-pointer"
              >
                <input
                  type="radio"
                  value={p}
                  {...register("position")}
                  className="mr-2"
                />
                {p}
              </label>
            ))}
          </div>
        </div>
      </section>

      <div className="flex justify-between">
        <Link to="/setup/topics" className="px-4 py-2 rounded-lg border">
          ← Назад
        </Link>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg border"
          style={{ background: "var(--color-yellow)" }}
        >
          Далее →
        </button>
      </div>
    </form>
  );
}
