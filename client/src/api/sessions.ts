import { api } from "../lib/http";

export type SessionItem = {
  _id: string;
  status: "draft" | "in_progress" | "scheduled" | "completed" | "canceled";
  snapshot: {
    title: string;
    description?: string;
    topics: string[];
    durationMin: number;
    difficulty: "easy" | "medium" | "hard";
    position: "Junior" | "Middle" | "Senior";
  };
  scheduledAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export interface SessionsListResponse {
  items: SessionItem[];
}

export interface CreateSessionResponse {
  item: SessionItem;
}

/** Универсальный JSON-объект без any */
export type JsonObject = Record<string, unknown>;

export function fetchSessions() {
  return api.get<SessionsListResponse>("/sessions");
}

export function createSessionFromTemplate(
  templateId: string,
  source: "global" | "user" = "global",
  scheduledAt?: string | null,
  meta?: JsonObject,
) {
  return api.post<
    CreateSessionResponse,
    {
      templateId: string;
      source: "global" | "user";
      scheduledAt?: string | null;
      meta?: JsonObject;
    }
  >("/sessions", { templateId, source, scheduledAt, meta });
}

/** Ответ стартa сессии — пока не полагаемся на структуру, убрали any */
export interface StartSessionResponse {
  // некоторые бэкенды возвращают сводку; оставим как unknown, чтобы не рушить интерфейс
  item?: unknown;
  session?: unknown;
  ok?: boolean;
}

export function startSession(sessionId: string) {
  return api.post<StartSessionResponse>(`/sessions/${sessionId}/start`);
}
