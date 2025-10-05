// client/src/pages/Setup/Steps/SessionStep.tsx
import { useFormContext } from "react-hook-form";
import { useNavigate, Link, useOutletContext } from "react-router-dom";
import type { SetupForm } from "../../../features/setup/useSetupForm";
import {
  DURATIONS,
  LEVELS,
  POSITIONS,
} from "../../../features/setup/useSetupForm";
import Button from "../../../components/ui/Button";

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
          <div className="mb-2 font-medium text-brand-deep dark:text-brand-white">
            Длительность
          </div>
          <div className="flex flex-wrap gap-2">
            {DURATIONS.map((d) => (
              <label
                key={d}
                className="px-3 py-1 rounded-2xl border border-brand-light cursor-pointer hover:bg-brand-light/15 dark:border-neutral-700 dark:hover:bg-neutral-800/50"
              >
                <input
                  type="radio"
                  value={d}
                  {...register("duration")}
                  className="mr-2 accent-brand-deep"
                />
                {d} мин
              </label>
            ))}
          </div>
        </div>

        {/* level */}
        <div>
          <div className="mb-2 font-medium text-brand-deep dark:text-brand-white">
            Сложность
          </div>
          <div className="flex flex-wrap gap-2">
            {LEVELS.map((l) => (
              <label
                key={l}
                className="px-3 py-1 rounded-2xl border border-brand-light cursor-pointer hover:bg-brand-light/15 dark:border-neutral-700 dark:hover:bg-neutral-800/50"
              >
                <input
                  type="radio"
                  value={l}
                  {...register("level")}
                  className="mr-2 accent-brand-deep"
                />
                {l}
              </label>
            ))}
          </div>
        </div>

        {/* position */}
        <div>
          <div className="mb-2 font-medium text-brand-deep dark:text-brand-white">
            Позиция
          </div>
          <div className="flex flex-wrap gap-2">
            {POSITIONS.map((p) => (
              <label
                key={p}
                className="px-3 py-1 rounded-2xl border border-brand-light cursor-pointer hover:bg-brand-light/15 dark:border-neutral-700 dark:hover:bg-neutral-800/50"
              >
                <input
                  type="radio"
                  value={p}
                  {...register("position")}
                  className="mr-2 accent-brand-deep"
                />
                {p}
              </label>
            ))}
          </div>
        </div>
      </section>

      <div className="flex justify-between">
        <Link to="/setup/topics" className="btn btn-outline">
          ← Назад
        </Link>

        <Button type="submit" variant="primary">
          Далее →
        </Button>
      </div>
    </form>
  );
}
