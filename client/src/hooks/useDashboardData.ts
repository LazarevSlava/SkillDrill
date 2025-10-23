import * as React from "react";
import {
  fetchSessionTemplates,
  SessionTemplate,
} from "../api/sessionTemplates";
import {
  fetchSessions,
  createSessionFromTemplate,
  startSession,
  SessionItem,
} from "../api/sessions";
import { createUserTemplate } from "../api/userTemplates";
import { toTopics } from "../pages/Dashboard/utils/normalize";

type BusyKey = string | null;

export function useDashboardData() {
  const [templates, setTemplates] = React.useState<SessionTemplate[]>([]);
  const [sessions, setSessions] = React.useState<SessionItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [busy, setBusy] = React.useState<BusyKey>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const [tplRes, sesRes] = await Promise.all([
        fetchSessionTemplates(),
        fetchSessions(),
      ]);
      setTemplates(tplRes);
      setSessions(sesRes.items);
      // console.debug("[templates]", tplRes);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      await load();
      if (!alive) return;
    })();
    return () => {
      alive = false;
    };
  }, [load]);

  async function handleCreateFromTemplate(tplId: string) {
    try {
      setBusy(`tpl:${tplId}`);
      const tpl = templates.find((t) => t._id === tplId);

      if (!tpl) {
        // fallback — создаём сессию из глобального пресета, чтобы UX не падал
        const res = await createSessionFromTemplate(tplId, "global");
        setSessions((prev) => [res.item, ...prev]);
        return;
      }

      // 1) создаём пользовательский шаблон на основе выбранного пресета
      const userTpl = await createUserTemplate({
        title: tpl.title ?? `Мой пресет — ${new Date().toLocaleDateString()}`,
        topics: toTopics(tpl.topics),
        durationMin: Number(tpl.durationMin) || 30,
        difficulty: tpl.difficulty,
        position: tpl.position,
      });

      // 2) создаём сессию уже из user-template
      const ses = await createSessionFromTemplate(userTpl.item._id, "user");

      // 3) кладём сессию наверх списка
      setSessions((prev) => [ses.item, ...prev]);
    } finally {
      setBusy(null);
    }
  }

  async function handleCreateCustom() {
    try {
      setBusy("new");
      const tpl = await createUserTemplate({
        title: `Мой пресет ${new Date().toLocaleDateString()}`,
        topics: ["js"],
        durationMin: 30,
        difficulty: "medium",
        position: "Middle",
      });
      const s = await createSessionFromTemplate(tpl.item._id, "user");
      setSessions((prev) => [s.item, ...prev]);
    } finally {
      setBusy(null);
    }
  }

  async function handleStart(sessionId: string) {
    try {
      setBusy(`start:${sessionId}`);
      await startSession(sessionId);
      setSessions((prev) =>
        prev.map((s) =>
          s._id === sessionId ? { ...s, status: "in_progress" } : s,
        ),
      );
    } finally {
      setBusy(null);
    }
  }

  return {
    // state
    templates,
    sessions,
    loading,
    busy,
    // actions
    load,
    handleCreateFromTemplate,
    handleCreateCustom,
    handleStart,
  };
}
