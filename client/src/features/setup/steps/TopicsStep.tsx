// client/src/pages/Setup/Steps/TopicsStep.tsx
import { useFormContext } from "react-hook-form";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { SetupForm } from "../../../features/setup/useSetupForm";
import { ALL_TOPICS } from "../../../features/setup/useSetupForm";
import Button from "../../../components/ui/Button";

type Ctx = { go: (to: string) => void };

export default function TopicsStep() {
  const { watch, setValue, formState, trigger } = useFormContext<SetupForm>();
  const nav = useNavigate();
  const { go } = useOutletContext<Ctx>();
  const topics = watch("topics");

  function toggle(t: (typeof ALL_TOPICS)[number]) {
    const has = topics.includes(t);
    setValue("topics", has ? topics.filter((x) => x !== t) : [...topics, t], {
      shouldValidate: true,
    });
  }

  async function next() {
    const ok = await trigger(["topics"]);
    if (ok) (go ?? nav)("/setup/session");
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        void next();
      }}
    >
      <section>
        <div className="mb-2 font-medium text-brand-deep dark:text-brand-white">
          Темы и навыки
        </div>
        <p className="mb-3 text-sm text-brand-gray-blue dark:text-neutral-400">
          Выбери одну или несколько.
        </p>

        <div className="flex flex-wrap gap-2">
          {ALL_TOPICS.map((t) => {
            const selected = topics.includes(t);
            return (
              <button
                key={t}
                type="button"
                aria-pressed={selected}
                onClick={() => toggle(t)}
                className={[
                  "px-3 py-1 rounded-2xl border cursor-pointer transition",
                  "focus:outline-none focus:ring-2 focus:ring-brand-light",
                  selected
                    ? "bg-brand-yellow/20 border-brand-yellow text-brand-dark"
                    : "border-brand-light hover:bg-brand-light/15 dark:border-neutral-700 dark:hover:bg-neutral-800/50",
                ].join(" ")}
              >
                {t}
              </button>
            );
          })}
        </div>

        {formState.errors.topics && (
          <p className="mt-2 text-sm text-red-600">
            {formState.errors.topics.message as string}
          </p>
        )}
      </section>

      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Далее →
        </Button>
      </div>
    </form>
  );
}
