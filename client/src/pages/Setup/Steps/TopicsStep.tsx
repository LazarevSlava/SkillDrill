// client/src/pages/Setup/Steps/TopicsStep.tsx
import { useFormContext } from "react-hook-form";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { SetupForm } from "../../../features/setup/useSetupForm";
import { ALL_TOPICS } from "../../../features/setup/useSetupForm";

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
        <div className="mb-2 font-medium">Темы и навыки</div>
        <p className="text-sm text-gray-600 mb-3">Выбери одну или несколько.</p>
        <div className="flex flex-wrap gap-2">
          {ALL_TOPICS.map((t) => {
            const selected = topics.includes(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggle(t)}
                className={`px-3 py-1 rounded-2xl border ${selected ? "bg-yellow-100 border-yellow-400" : ""}`}
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
