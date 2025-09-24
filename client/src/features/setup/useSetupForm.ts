// client/src/features/setup/useSetupForm.ts
import { useEffect, useRef } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SetupFormValues, Level, Position, Tone, Focus } from "./types";
import {
  readSetupDraft,
  writeSetupDraft,
  clearSetupDraft,
  markSetupCompleted,
} from "./storage";

// Чистая финализация — можно вызывать из любых мест (шагов мастера)
export function finalizeSetup(): void {
  markSetupCompleted();
  clearSetupDraft();
}

// Константы (один источник)
export const ALL_TOPICS = ["javascript", "react", "python", "node"] as const;
export const DURATIONS = [15, 30, 60] as const;
export const LEVELS: Level[] = ["easy", "medium", "hard"];
export const POSITIONS: Position[] = ["junior", "middle", "senior"];
export const TONES: Tone[] = ["ty", "vy"];
export const FOCUSES: Focus[] = ["algorithms", "system", "frameworks"];

export const DEFAULTS: SetupFormValues = {
  topics: [],
  duration: 30,
  level: "medium",
  position: "middle",
  tone: "ty",
  focus: "frameworks",
  voice: true,
};

// Для RHF defaultValues используем input-тип
export type SetupForm = z.output<typeof setupSchema>; // после резолвера (нормализовано)
export type SetupFormInput = z.input<typeof setupSchema>; // то, что "заходит" в форму

// zod-схема (коэрсим duration из строки ради инпутов)
export const setupSchema = z.object({
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

// Контекст формы нам не нужен — чтобы не использовать any:
type FormCtx = undefined;

// Возвращаем именно UseFormReturn<SetupFormInput, FormCtx, SetupForm>
type UseSetupFormReturn = UseFormReturn<SetupFormInput, FormCtx, SetupForm> & {
  submitAndFinish: () => void;
};

// Статический источник значений по умолчанию в input-формате
export const DEFAULTS_INPUT: SetupFormInput = DEFAULTS as SetupFormInput;

export function useSetupForm(): UseSetupFormReturn {
  // Читаем драфт типобезопасно
  const draft = readSetupDraft<SetupFormInput>();

  // RHF читает defaultValues один раз при инициализации — мемоизация не нужна
  const defaultValues: SetupFormInput = draft
    ? { ...DEFAULTS_INPUT, ...draft }
    : { ...DEFAULTS_INPUT };

  // useForm: <TFieldValues, TContext, TTransformedValues>
  const form = useForm<SetupFormInput, FormCtx, SetupForm>({
    defaultValues,
    resolver: zodResolver(setupSchema), // дженерики выводятся автоматически
    mode: "onChange",
  });

  // --- ДЕБАУНС АВТОСЕЙВА ---
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>("");

  useEffect(() => {
    const sub = form.watch((values) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

      saveTimerRef.current = setTimeout(() => {
        const serialized = JSON.stringify(values);
        if (serialized !== lastSavedRef.current) {
          // values здесь имеют тип SetupFormInput — для localStorage идеально
          writeSetupDraft(values);
          lastSavedRef.current = serialized;
        }
      }, 400); // 300–500 мс
    });

    return () => {
      sub.unsubscribe();
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [form]);

  const submitAndFinish = () => {
    // тут позже будет POST /api/setup
    finalizeSetup();
  };

  // Расширяем объект формы методом и приводим тип
  return { ...form, submitAndFinish } as UseSetupFormReturn;
}
