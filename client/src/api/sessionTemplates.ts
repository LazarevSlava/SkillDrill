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

export async function fetchSessionTemplates() {
  return api.get<{ items: SessionTemplate[] }>("/session-templates");
}
