import type { Session } from "./helpers";

export const presetTemplates: Session[] = [
  {
    id: "tpl-1",
    title: "JS + Алгоритмы",
    language: "JavaScript",
    level: "Middle",
    difficulty: "medium",
    durationMin: 30,
    status: "draft",
  },
  {
    id: "tpl-2",
    title: "React + Hooks",
    language: "React",
    level: "Junior",
    difficulty: "easy",
    durationMin: 15,
    status: "draft",
  },
  {
    id: "tpl-3",
    title: "Node.js + REST API",
    language: "Node.js",
    level: "Middle",
    difficulty: "medium",
    durationMin: 30,
    status: "draft",
  },
];

export const userSessions: Session[] = [
  {
    id: "s-101",
    title: "React System Design",
    language: "React",
    level: "Senior",
    difficulty: "hard",
    durationMin: 60,
    status: "completed",
    lastRunAt: "2025-09-25T10:30:00.000Z",
  },
  {
    id: "s-102",
    title: "Python Async",
    language: "Python",
    level: "Middle",
    difficulty: "medium",
    durationMin: 30,
    status: "scheduled",
    scheduledAt: "2025-10-08T18:00:00.000Z",
  },
];
