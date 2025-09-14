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
    <section
      id="how"
      className="
        bg-[color-mix(in_oklab,var(--color-light-blue)_10%,white)]
      "
    >
      <div className="section">
        <h2 className="text-3xl font-bold text-[var(--color-deep-blue)]">
          Как это работает
        </h2>
        <p className="mt-2 max-w-2xl text-[var(--color-gray-blue)]">
          Тренируй навыки без стресса и с пользой — от быстрых спринтов до
          часовых сессий.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={i}
              className="
                card p-6 transition
                border border-[var(--color-light-blue)]/40
                hover:shadow-md hover:border-[var(--color-deep-blue)]/40
              "
            >
              {/* Номер шага */}
              <div
                className="
                  mb-3 inline-flex h-9 w-9 items-center justify-center
                  rounded-xl font-bold
                  bg-[color:var(--color-light-blue)] text-[var(--color-deep-blue)]
                  shadow-inner
                "
                aria-hidden="true"
              >
                {i + 1}
              </div>

              {/* Заголовок шага */}
              <div className="text-lg font-semibold text-[var(--color-deep-blue)]">
                {s.title}
              </div>

              {/* Описание */}
              <div className="mt-1 text-[var(--color-gray-blue)]">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
