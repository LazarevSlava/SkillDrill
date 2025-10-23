// selectors/toSessionCardData.ts
import type { SessionCardData } from "../../../pages/Dashboard/SessionCard";
import type { SessionTemplate } from "../../../api/sessionTemplates";
import type { SessionItem } from "../../../api/sessions";
import {
  inferLanguageFromTopics,
  mapStatus,
  toDuration,
  toTopics,
} from "../utils/normalize";

export function mapSessionsToUI(
  sessions: SessionItem[],
  handlers: { onStart: (id: string) => Promise<void> }, // ⟵ важно: Promise<void>
): SessionCardData[] {
  return sessions.map((s): SessionCardData => {
    const topics = toTopics(s.snapshot?.topics);
    return {
      id: s._id,
      title: s.snapshot?.title ?? "Без названия",
      language: inferLanguageFromTopics(topics),
      level: s.snapshot?.position,
      difficulty: s.snapshot?.difficulty,
      durationMin: toDuration(Number(s.snapshot?.durationMin)),
      scheduledAt: s.scheduledAt ?? undefined,
      status: mapStatus(s.status),
      tags: topics,
      isTemplate: false,
      onStart: async () => {
        await handlers.onStart(s._id); // ⟵ обёртка async, возвращаем Promise<void>
      },
      onEdit: () => {},
    };
  });
}

export function mapTemplatesToUI(
  templates: SessionTemplate[],
  handlers: { onCreateFromTemplate: (tplId: string) => Promise<void> }, // ⟵ Promise<void>
): SessionCardData[] {
  return templates.map((t): SessionCardData => {
    const topics = toTopics(t?.topics);
    const id = t._id;
    return {
      id,
      title: t.title ?? "Шаблон",
      language: inferLanguageFromTopics(topics),
      level: t.position,
      difficulty: t.difficulty,
      durationMin: toDuration(Number(t.durationMin)),
      scheduledAt: undefined,
      lastRunAt: undefined,
      status: "draft",
      tags: topics,
      isTemplate: true,
      onCreateFromTemplate: async () => {
        await handlers.onCreateFromTemplate(id); // ⟵ async
      },
      // isBusy: busyKey === `tpl:${id}`,
    };
  });
}
