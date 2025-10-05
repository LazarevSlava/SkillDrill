// client/src/pages/Setup/Steps/PreferencesStep.tsx
import { useFormContext } from "react-hook-form";
import { useNavigate, Link, useOutletContext } from "react-router-dom";
import type { SetupForm } from "../useSetupForm";
import { TONES, FOCUSES } from "../useSetupForm";
import Button from "../../../components/ui/Button";

type Ctx = { go: (to: string) => void };

export default function PreferencesStep() {
  const { register, trigger } = useFormContext<SetupForm>();
  const nav = useNavigate();
  const { go } = useOutletContext<Ctx>();

  async function next() {
    const ok = await trigger(["tone", "focus", "voice"]);
    if (ok) (go ?? nav)("/setup/review");
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
        {/* tone */}
        <div>
          <div className="mb-2 font-medium text-brand-deep dark:text-brand-white">
            Обращение
          </div>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <label
                key={t}
                className="px-3 py-1 rounded-2xl border border-brand-light cursor-pointer hover:bg-brand-light/15 dark:border-neutral-700 dark:hover:bg-neutral-800/50"
              >
                <input
                  type="radio"
                  value={t}
                  {...register("tone")}
                  className="mr-2 accent-brand-deep"
                />
                {t}
              </label>
            ))}
          </div>
        </div>

        {/* focus */}
        <div>
          <div className="mb-2 font-medium text-brand-deep dark:text-brand-white">
            Акцент
          </div>
          <div className="flex flex-wrap gap-2">
            {FOCUSES.map((f) => (
              <label
                key={f}
                className="px-3 py-1 rounded-2xl border border-brand-light cursor-pointer hover:bg-brand-light/15 dark:border-neutral-700 dark:hover:bg-neutral-800/50"
              >
                <input
                  type="radio"
                  value={f}
                  {...register("focus")}
                  className="mr-2 accent-brand-deep"
                />
                {f}
              </label>
            ))}
          </div>
        </div>

        {/* voice */}
        <div className="flex items-end">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              {...register("voice")}
              className="accent-brand-deep"
            />
            <span className="text-brand-dark dark:text-brand-white">
              Голос + текст
            </span>
          </label>
        </div>
      </section>

      <div className="flex justify-between">
        {/* Назад — используем Link как кнопку, без вложенного <button> */}
        <Link to="/setup/session" className="btn btn-outline">
          ← Назад
        </Link>

        <Button type="submit" variant="primary">
          Далее →
        </Button>
      </div>
    </form>
  );
}
