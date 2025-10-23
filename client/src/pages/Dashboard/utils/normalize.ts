// Общие утилиты нормализации/преобразования

import type { SessionItem } from "../../../api/sessions";

export type Language =
  | "JavaScript"
  | "TypeScript"
  | "Python"
  | "React"
  | "Node.js";
export type Duration = 15 | 30 | 60;

export function toDuration(n: number): Duration {
  if (n <= 15) return 15;
  if (n <= 30) return 30;
  return 60;
}

export function inferLanguageFromTopics(topics: string[] = []): Language {
  const t = topics.map((s) => s.toLowerCase());
  if (t.includes("react")) return "React";
  if (t.includes("node") || t.includes("node.js") || t.includes("nodejs"))
    return "Node.js";
  if (t.includes("typescript") || t.includes("ts")) return "TypeScript";
  if (t.includes("python")) return "Python";
  return "JavaScript";
}

export function mapStatus(
  apiStatus: SessionItem["status"],
): "draft" | "scheduled" | "completed" {
  if (apiStatus === "draft") return "draft";
  if (apiStatus === "completed") return "completed";
  return "scheduled";
}

export function toTopics(val: unknown): string[] {
  if (Array.isArray(val)) return val.filter(Boolean).map(String);
  if (typeof val === "string" && val.trim()) {
    return val.split(/[,\s]+/).filter(Boolean);
  }
  return [];
}
