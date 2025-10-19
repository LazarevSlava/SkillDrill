// Если у тебя ещё нет общего JSON-типа — добавь:
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [k: string]: JsonValue }
  | JsonValue[];

// (опционально) уточняем статусы, если хочешь строгий союз
export type ApiSessionStatus =
  | "draft"
  | "in_progress"
  | "scheduled"
  | "completed"
  | "canceled";

// Основной тип сводки дашборда
export type DashboardSummary = {
  totals: {
    all: number;
    draft: number;
    in_progress: number;
    scheduled: number;
    completed: number;
  };
  templates: {
    globalActive: number;
    userOwned: number;
  };
  upcoming: Array<{
    _id: string;
    scheduledAt: string; // ISO
    status: ApiSessionStatus | string; // если бекенд может прислать неожиданный статус
    title: string;
    durationMin: number | null;
    topics: string[];
  }>;
  recentRuns: Array<{
    _id: string;
    sessionId: string;
    startedAt: string; // ISO
    finishedAt?: string; // ISO
    durationSec?: number;
    result?: string;
    metrics?: Record<string, JsonValue>; // <-- больше не any
    sessionTitle: string;
    sessionTopics: string[];
  }>;
  now: string; // ISO
};
