type PricingProps = { onOpenSignup: () => void };

export default function Pricing({ onOpenSignup }: PricingProps) {
  return (
    <section id="pricing" className="bg-white">
      <div className="section">
        <h2
          className="text-3xl font-bold"
          style={{ color: "var(--color-deep-blue)" }}
        >
          Простые тарифы
        </h2>
        <p
          className="mt-2 max-w-2xl"
          style={{ color: "var(--color-gray-blue)" }}
        >
          Начни бесплатно — плати только если нравится формат и результат.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Free */}
          <div className="card p-6">
            <div
              className="text-sm font-semibold"
              style={{ color: "var(--color-deep-blue)" }}
            >
              Free
            </div>
            <div
              className="mt-2 text-3xl font-extrabold"
              style={{ color: "var(--color-dark-gray)" }}
            >
              ₪0
            </div>
            <ul
              className="mt-4 space-y-2"
              style={{ color: "var(--color-gray-blue)" }}
            >
              <li>• 1–2 интервью</li>
              <li>• Базовая аналитика</li>
              <li>• Без карты</li>
            </ul>
            <button
              onClick={onOpenSignup}
              className="btn btn-outline mt-6 w-full"
            >
              Начать
            </button>
          </div>

          {/* Pro (featured) */}
          <div
            className="rounded-3xl border-2 p-6 shadow-xl"
            style={{
              borderColor: "var(--color-yellow)",
              backgroundColor: "var(--color-white)",
            }}
          >
            <div
              className="text-sm font-semibold"
              style={{ color: "var(--color-deep-blue)" }}
            >
              Pro
            </div>
            <div
              className="mt-2 text-3xl font-extrabold"
              style={{ color: "var(--color-dark-gray)" }}
            >
              ₪/мес
            </div>
            <ul
              className="mt-4 space-y-2"
              style={{ color: "var(--color-gray-blue)" }}
            >
              <li>• 10–20 интервью</li>
              <li>• Расширенная аналитика</li>
              <li>• Экспорт рекомендаций</li>
            </ul>
            <button
              onClick={onOpenSignup}
              className="btn btn-primary mt-6 w-full"
            >
              Оформить
            </button>
          </div>

          {/* Yearly */}
          <div className="card p-6">
            <div
              className="text-sm font-semibold"
              style={{ color: "var(--color-deep-blue)" }}
            >
              Yearly
            </div>
            <div
              className="mt-2 text-3xl font-extrabold"
              style={{ color: "var(--color-dark-gray)" }}
            >
              ₪/год
            </div>
            <ul
              className="mt-4 space-y-2"
              style={{ color: "var(--color-gray-blue)" }}
            >
              <li>• Всё из Pro</li>
              <li>• Экономия до 30%</li>
              <li>• Приоритет поддержки</li>
            </ul>
            <button
              onClick={onOpenSignup}
              className="btn btn-outline mt-6 w-full"
            >
              Купить
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
