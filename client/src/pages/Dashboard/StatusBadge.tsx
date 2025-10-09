export default function StatusBadge({
  status,
}: {
  status: "draft" | "scheduled" | "completed";
}) {
  const map = {
    draft: {
      label: "Черновик",
      tone: "bg-yellow-100 border-yellow-400",
    },
    scheduled: {
      label: "Запланировано",
      tone: "bg-[color:var(--color-light-blue)]/30",
    },
    completed: {
      label: "Завершено",
      tone: "bg-[color:var(--color-light-blue)]/50",
    },
  };
  const cfg = map[status];
  return <span className={`badge border ${cfg.tone}`}>{cfg.label}</span>;
}
