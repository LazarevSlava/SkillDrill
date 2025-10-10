import { api } from "../lib/http";

export function createUserTemplate(payload: {
  title: string;
  description?: string;
  topics: string[];
  durationMin: number;
  difficulty: "easy" | "medium" | "hard";
  position: "Junior" | "Middle" | "Senior";
  isActive?: boolean;
}) {
  return api.post<{ item: { _id: string } }>("/user-templates", payload);
}
