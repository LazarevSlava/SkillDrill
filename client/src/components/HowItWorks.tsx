export default function HowItWorks() {
  const steps = [
    {
      title: "Выбери тему и уровень",
      desc: "JS, React, Python • Junior/Middle/Senior",
    },
    {
      title: "Укажи длительность",
      desc: "15/30/60 минут — гибко под твой график",
    },
    { title: "Отвечай голосом", desc: "Реалистичный формат интервью с AI" },
    { title: "Получай анализ", desc: "Сильные/слабые стороны, рекомендации" },
  ];

  return (
    <section id="how" className="bg-white">
      <div className="section">
        <h2
          className="text-3xl font-bold"
          style={{ color: "var(--color-deep-blue)" }}
        >
          Как это работает
        </h2>
        <p
          className="mt-2 max-w-2xl"
          style={{ color: "var(--color-gray-blue)" }}
        >
          Тренируй навыки без стресса и с пользой — от быстрых спринтов до
          часовых сессий.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={i} className="card p-6">
              <div
                className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl font-bold"
                style={{
                  backgroundColor: "var(--color-light-blue)",
                  color: "var(--color-deep-blue)",
                }}
              >
                {i + 1}
              </div>
              <div
                className="text-lg font-semibold"
                style={{ color: "var(--color-deep-blue)" }}
              >
                {s.title}
              </div>
              <div className="mt-1" style={{ color: "var(--color-gray-blue)" }}>
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
