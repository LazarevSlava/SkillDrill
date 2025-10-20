import { api } from "../lib/http";

export type SessionTemplate = {
  _id: string;
  title: string;
  description?: string;
  topics: string[];
  durationMin: number;
  difficulty: "easy" | "medium" | "hard";
  position: "Junior" | "Middle" | "Senior";
};

export async function fetchSessionTemplates(): Promise<SessionTemplate[]> {
  const res = await api.get<unknown>("/session-templates");
  if (Array.isArray(res)) return res as SessionTemplate[];
  if (res && typeof res === "object") {
    const r = res as Record<string, unknown>;
    if (Array.isArray(r.items)) return r.items as SessionTemplate[];
    if (Array.isArray(r.data)) return r.data as SessionTemplate[];
    if (Array.isArray(r.results)) return r.results as SessionTemplate[];
  }
  return [];
}
