type HeroProps = { onOpenSignup: () => void };

export default function Hero({ onOpenSignup }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[var(--color-light-blue)]/40 to-white">
      <div className="section grid grid-cols-1 items-center gap-10 md:grid-cols-2">
        {/* Left: copy */}
        <div>
          <h1
            className="text-4xl font-extrabold leading-tight md:text-5xl"
            style={{ color: "var(--color-deep-blue)" }}
          >
            Тренируйся как на реальном собеседовании
          </h1>
          <p
            className="mt-4 text-lg"
            style={{ color: "var(--color-gray-blue)" }}
          >
            SkillDrill — платформа симуляции тех-интервью (JS, React, Python).
            Голосовой AI задаёт вопросы, ты отвечаешь — получаешь разбор и
            рекомендации.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button onClick={onOpenSignup} className="btn btn-primary">
              Начать бесплатно
            </button>
            <a href="#how" className="btn btn-outline">
              Как это работает
            </a>
          </div>

          <div
            className="mt-6 flex items-center gap-4 text-sm"
            style={{ color: "var(--color-gray-blue)" }}
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: "var(--color-yellow)" }}
              />
              1–2 интервью бесплатно
            </div>
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: "var(--color-deep-blue)" }}
              />
              Без привязки карты
            </div>
          </div>
        </div>

        {/* Right: mockup */}
        <div className="relative">
          <div className="card border p-4">
            <div
              className="rounded-2xl p-4 text-white"
              style={{ backgroundColor: "var(--color-deep-blue)" }}
            >
              <div className="text-sm opacity-80">AI Interviewer</div>
              <div className="mt-2 text-lg font-semibold">
                Расскажите про замыкания в JavaScript
              </div>
              <div
                className="mt-4 space-y-2"
                style={{ color: "var(--color-light-blue)" }}
              >
                <div className="rounded-xl bg-black/20 p-3">
                  Подсказка: замыкание — это функция + лексическое окружение…
                </div>
                <div className="rounded-xl bg-black/20 p-3">
                  Ваш ответ записывается…
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
              <div className="card p-3">
                <div
                  className="font-semibold"
                  style={{ color: "var(--color-deep-blue)" }}
                >
                  JS
                </div>
                <div style={{ color: "var(--color-gray-blue)" }}>
                  Middle • 30 мин
                </div>
              </div>
              <div className="card p-3">
                <div
                  className="font-semibold"
                  style={{ color: "var(--color-deep-blue)" }}
                >
                  React
                </div>
                <div style={{ color: "var(--color-gray-blue)" }}>
                  Hooks • Patterns
                </div>
              </div>
              <div className="card p-3">
                <div
                  className="font-semibold"
                  style={{ color: "var(--color-deep-blue)" }}
                >
                  Python
                </div>
                <div style={{ color: "var(--color-gray-blue)" }}>
                  Algo • OOP
                </div>
              </div>
            </div>
          </div>

          {/* Decorative blob */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full blur-2xl"
            style={{
              backgroundColor:
                "color-mix(in oklab, var(--color-yellow), transparent 60%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
