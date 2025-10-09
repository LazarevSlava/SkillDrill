export default function ProgressOverview() {
  const stats = [
    { label: "Всего сессий", value: 18 },
    { label: "Завершено", value: 12 },
    { label: "В процессе", value: 3 },
    { label: "Запланировано", value: 3 },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="card p-4">
          <div className="text-sm text-[color:var(--color-gray-blue)]">
            {s.label}
          </div>
          <div className="mt-1 text-2xl font-extrabold text-[color:var(--color-dark-gray)]">
            {s.value}
          </div>
        </div>
      ))}
    </div>
  );
}
