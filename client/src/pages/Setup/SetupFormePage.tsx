import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type {
  SetupFormValues,
  Topic,
  Level,
  Position,
  Tone,
  Focus,
} from "../../features/setup/types";
import {
  readSetupDraft,
  writeSetupDraft,
  clearSetupDraft,
  markSetupCompleted,
} from "../../features/setup/storage";

// Опции для рендеринга
const ALL_TOPICS = ["javascript", "react", "python", "node"] as const;

const durations = [15, 30, 60] as const;
const levels: Level[] = ["easy", "medium", "hard"];
const positions: Position[] = ["junior", "middle", "senior"];
const tones: Tone[] = ["ty", "vy"];
const focuses: Focus[] = ["algorithms", "system", "frameworks"];

const DEFAULTS: SetupFormValues = {
  topics: [],
  duration: 30,
  level: "medium",
  position: "middle",
  tone: "ty",
  focus: "frameworks",
  voice: true,
};

// Простая схема валидации
const schema = z.object({
  topics: z.array(z.enum(ALL_TOPICS)).min(1, "Выберите хотя бы одну тему"),
  duration: z.coerce
    .number()
    .pipe(z.union([z.literal(15), z.literal(30), z.literal(60)])),
  level: z.enum(["easy", "medium", "hard"]),
  position: z.enum(["junior", "middle", "senior"]),
  tone: z.enum(["ty", "vy"]),
  focus: z.enum(["algorithms", "system", "frameworks"]),
  voice: z.boolean(),
});

type Form = SetupFormValues;

export default function SetupFormPage() {
  const nav = useNavigate();

  // подхватываем черновик из localStorage
  const draft = readSetupDraft();
  const defaultValues: Form = draft ? { ...DEFAULTS, ...draft } : DEFAULTS;

  const { register, handleSubmit, watch, control, setValue, formState } =
    useForm<Form>({
      defaultValues,
      resolver: zodResolver(schema as any),
      mode: "onChange",
    });
  // 1) Таймер для дебаунса
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 2) Чтобы не писать одинаковые данные (мелкая оптимизация)
  const lastSavedRef = useRef<string>("");
  // Автосейв черновика в localStorage при любых изменениях
  useEffect(() => {
    const sub = watch((values) => {
      // Сбрасываем прошлый таймер
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      // Стартуем новый (500 мс )
      saveTimerRef.current = setTimeout(() => {
        const serialized = JSON.stringify(values);
        if (serialized !== lastSavedRef.current) {
          writeSetupDraft(values as SetupFormValues);
          lastSavedRef.current = serialized;
        }
      }, 500);
    });

    return () => {
      sub.unsubscribe();
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [watch]);

  function onSubmit(values: Form) {
    // тут позже будет POST /api/setup
    writeSetupDraft(values); //temporal for use values
    markSetupCompleted();
    clearSetupDraft();
    nav("/dashboard");
  }

  // вспомогалки для рендеринга «чипсов»
  function toggleTopic(t: Topic) {
    const current = watch("topics");
    const has = current.includes(t);
    setValue("topics", has ? current.filter((x) => x !== t) : [...current, t], {
      shouldValidate: true,
    });
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1
        className="text-2xl font-semibold mb-4"
        style={{ color: "var(--color-deep-blue)" }}
      >
        Мастер настройки
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl border bg-white p-4 shadow-sm space-y-8"
      >
        {/* Topics */}
        <section>
          <div className="mb-2 font-medium">Темы и навыки</div>
          <p className="text-sm text-gray-600 mb-3">
            Выбери одну или несколько.
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_TOPICS.map((t) => {
              const selected = watch("topics").includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTopic(t)}
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

        {/* Session */}
        <section className="grid gap-6 md:grid-cols-3">
          {/* duration */}
          <div>
            <div className="mb-2 font-medium">Длительность</div>
            <div className="flex flex-wrap gap-2">
              {durations.map((d) => (
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
              {levels.map((l) => (
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
              {positions.map((p) => (
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

        {/* Preferences */}
        <section className="grid gap-6 md:grid-cols-3">
          {/* tone */}
          <div>
            <div className="mb-2 font-medium">Обращение</div>
            <div className="flex flex-wrap gap-2">
              {tones.map((t) => (
                <label
                  key={t}
                  className="px-3 py-1 rounded-2xl border cursor-pointer"
                >
                  <input
                    type="radio"
                    value={t}
                    {...register("tone")}
                    className="mr-2"
                  />
                  {t}
                </label>
              ))}
            </div>
          </div>

          {/* focus */}
          <div>
            <div className="mb-2 font-medium">Акцент</div>
            <div className="flex flex-wrap gap-2">
              {focuses.map((f) => (
                <label
                  key={f}
                  className="px-3 py-1 rounded-2xl border cursor-pointer"
                >
                  <input
                    type="radio"
                    value={f}
                    {...register("focus")}
                    className="mr-2"
                  />
                  {f}
                </label>
              ))}
            </div>
          </div>

          {/* voice */}
          <div className="flex items-end">
            <label className="inline-flex items-center gap-2">
              <Controller
                control={control}
                name="voice"
                render={({ field }) => (
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
              <span>Голос + текст</span>
            </label>
          </div>
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="px-4 py-2 rounded-lg border"
            style={{ background: "var(--color-yellow)" }}
          >
            Сохранить и продолжить → /dashboard
          </button>
        </div>
      </form>
    </div>
  );
}
