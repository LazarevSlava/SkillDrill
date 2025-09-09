export default function FAQ() {
  const qa = [
    {
      q: "Нужен ли микрофон?",
      a: "Да, для голосовых ответов. Можно также отвечать текстом, если микрофона нет.",
    },
    {
      q: "Какие темы доступны?",
      a: "JS, React, Python — базово. Далее добавим Node.js, системы, алгоритмы.",
    },
    {
      q: "Есть ли бесплатный доступ?",
      a: "Да, 1–2 интервью бесплатно без привязки карты.",
    },
    {
      q: "Где хранится прогресс?",
      a: "В личном кабинете, с детальной аналитикой по сессиям и рекомендациями.",
    },
  ];

  return (
    <section
      id="faq"
      className="bg-[color-mix(in_okrgb,var(--color-light-blue)_/20%,white)]"
    >
      <div className="section">
        <h2
          className="text-3xl font-bold"
          style={{ color: "var(--color-deep-blue)" }}
        >
          FAQ
        </h2>

        <div
          className="mt-6 divide-y rounded-3xl border bg-white"
          style={
            {
              borderColor:
                "color-mix(in oklab, var(--color-light-blue), transparent 40%)",
              divideColor:
                "color-mix(in oklab, var(--color-light-blue), transparent 40%)",
            } as React.CSSProperties
          }
        >
          {qa.map((item, i) => (
            <details key={i} className="group p-6" open={i === 0}>
              <summary
                className="flex cursor-pointer list-none items-center justify-between text-lg font-semibold"
                style={{ color: "var(--color-deep-blue)" }}
              >
                {item.q}
                <span
                  className="ml-4 rounded-full border p-1 transition group-open:rotate-45"
                  style={{
                    borderColor: "var(--color-light-blue)",
                    color: "var(--color-gray-blue)",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="currentColor"
                  >
                    <path d="M11 5h2v14h-2z" />
                    <path d="M5 11h14v2H5z" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3" style={{ color: "var(--color-gray-blue)" }}>
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
