export default function Features() {
  const items = [
    {
      title: "Реалистичный формат",
      desc: "Голосовой диалог, таймер и сценарии как на настоящем интервью.",
    },
    {
      title: "Персональная обратная связь",
      desc: "Разбор ответов с примерами улучшений и планом практики.",
    },
    {
      title: "Гибкость настроек",
      desc: "Темы, уровень, длительность, акценты (алгоритмы/системы/фреймворки).",
    },
    {
      title: "Прогресс и цели",
      desc: "Личный кабинет с трекингом прогресса и рекомендациями.",
    },
  ];

  return (
    <section
      id="features"
      className="bg-[color-mix(in_okrgb,var(--color-light-blue)_/20%,white)]"
    >
      <div className="section">
        <h2
          className="text-3xl font-bold"
          style={{ color: "var(--color-deep-blue)" }}
        >
          Почему SkillDrill
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {items.map((f, i) => (
            <div key={i} className="card p-6">
              <div
                className="text-lg font-semibold"
                style={{ color: "var(--color-deep-blue)" }}
              >
                {f.title}
              </div>
              <div className="mt-2" style={{ color: "var(--color-gray-blue)" }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
