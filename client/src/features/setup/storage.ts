// client/src/features/setup/storage.ts
const DRAFT_KEY = "sd.setup.draft";
const COMPLETED_KEY = "sd.setup.completed";

export function readSetupDraft<T = unknown>(): T | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn("readSetupDraft: failed to parse draft", err);
    }
    return null;
  }
}

export function writeSetupDraft(draft: unknown): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn("writeSetupDraft: failed to save draft", err);
    }
  }
}

export function clearSetupDraft(): void {
  localStorage.removeItem(DRAFT_KEY);
}

export function markSetupCompleted(): void {
  localStorage.setItem(COMPLETED_KEY, "1");
}

export function isSetupCompleted(): boolean {
  return localStorage.getItem(COMPLETED_KEY) === "1";
}

export function unmarkSetupCompleted(): void {
  localStorage.removeItem(COMPLETED_KEY);
}

// Типобезопасно добавим dev-хелпер в globalThis без any
declare global {
  interface GlobalThis {
    SkillDrillResetSetup?: () => void;
  }
}

if (import.meta.env.DEV) {
  const g = globalThis as unknown as typeof globalThis & {
    SkillDrillResetSetup?: () => void;
  };

  g.SkillDrillResetSetup = () => {
    unmarkSetupCompleted();
    clearSetupDraft();

    console.log("✅ Setup state reset (draft cleared, completed flag removed)");
  };
}
