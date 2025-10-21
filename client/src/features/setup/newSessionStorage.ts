export type NewSessionData = {
  topics: string[];
  duration: 15 | 30 | 60;
  level: "easy" | "medium" | "hard";
  title: string;
  position?: "Junior" | "Middle" | "Senior";
  preferences?: Record<string, unknown>;
};

const KEY = "skilldrill:new-session";

export function loadNewSession(): NewSessionData | null {
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as NewSessionData) : null;
}
export function saveNewSession(data: Partial<NewSessionData>) {
  const prev = loadNewSession() ?? {};
  localStorage.setItem(KEY, JSON.stringify({ ...prev, ...data }));
}
export function clearNewSession() {
  localStorage.removeItem(KEY);
}
