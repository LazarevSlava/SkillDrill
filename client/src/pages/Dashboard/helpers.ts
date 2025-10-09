export type SessionStatus = "draft" | "scheduled" | "completed";

export interface Session {
  id: string;
  title: string;
  language: "JavaScript" | "TypeScript" | "Python" | "React" | "Node.js";
  level: "Junior" | "Middle" | "Senior";
  difficulty: "easy" | "medium" | "hard";
  durationMin: 15 | 30 | 60;
  scheduledAt?: string;
  lastRunAt?: string;
  status: SessionStatus;
}

export function formatDate(iso?: string) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}
