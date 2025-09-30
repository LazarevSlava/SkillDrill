import Button from "../ui/Button";

type HeroProps = { onOpenSignup: () => void };

export default function Hero({ onOpenSignup }: HeroProps) {
  return (
    <section
      className="
        relative overflow-hidden
        bg-gradient-to-b
        from-[color:var(--color-light-blue)]/40
        to-[color:var(--color-white)]
      "
    >
      <div className="section grid grid-cols-1 items-center gap-10 md:grid-cols-2">
        <div>
          <h1
            className="
              text-4xl md:text-5xl font-extrabold leading-tight
              text-[var(--color-deep-blue)]
            "
          >
            Тренируйся как на реальном собеседовании
          </h1>

          <p className="mt-4 text-lg text-[var(--color-gray-blue)]">
            SkillDrill — платформа симуляции тех-интервью (JS, React, Python).
            Голосовой AI задаёт вопросы, ты отвечаешь — получаешь разбор и
            рекомендации.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button onClick={onOpenSignup} variant="primary">
              Начать бесплатно
            </Button>
            <Button as="a" href="#how" variant="outline">
              Как это работает
            </Button>
          </div>

          <div className="mt-6 flex items-center gap-4 text-sm text-[var(--color-gray-blue)]">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-yellow)]" />
              1–2 интервью бесплатно
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-deep-blue)]" />
              Без привязки карты
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="card border p-4 rounded-3xl relative">
            <div className="relative z-10 rounded-2xl p-4 text-white bg-[color:var(--color-deep-blue)]">
              <div className="text-sm opacity-80">AI Interviewer</div>
              <div className="mt-2 text-lg font-semibold">
                Расскажите про замыкания в JavaScript
              </div>
              <div className="mt-4 space-y-2 text-[var(--color-light-blue)]">
                <div className="rounded-xl bg-black/20 p-3">
                  Подсказка: замыкание — это функция + лексическое окружение…
                </div>
                <div className="rounded-xl bg-black/20 p-3">
                  Ваш ответ записывается…
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-3 text-sm relative z-10">
              <div className="card p-3">
                <div className="font-semibold text-[var(--color-deep-blue)]">
                  JS
                </div>
                <div className="text-[var(--color-gray-blue)]">
                  Middle • 30 мин
                </div>
              </div>
              <div className="card p-3">
                <div className="font-semibold text-[var(--color-deep-blue)]">
                  React
                </div>
                <div className="text-[var(--color-gray-blue)]">
                  Hooks • Patterns
                </div>
              </div>
              <div className="card p-3">
                <div className="font-semibold text-[var(--color-deep-blue)]">
                  Python
                </div>
                <div className="text-[var(--color-gray-blue)]">Algo • OOP</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
