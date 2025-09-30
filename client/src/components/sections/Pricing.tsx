import Button from "../ui/Button";

type PricingProps = { onOpenSignup: () => void };

export default function Pricing({ onOpenSignup }: PricingProps) {
  return (
    <section id="pricing" className="bg-[color:var(--color-white)]">
      <div className="section">
        <h2 className="text-3xl font-bold text-[color:var(--color-deep-blue)]">
          Простые тарифы
        </h2>
        <p className="mt-2 max-w-2xl text-[color:var(--color-gray-blue)]">
          Начни бесплатно — плати только если нравится формат и результат.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Free */}
          <div
            className="
              card p-6 transition
              border border-[color:var(--color-light-blue)]/40
              hover:shadow-md hover:border-[color:var(--color-deep-blue)]/40
            "
          >
            <div className="text-sm font-semibold text-[color:var(--color-deep-blue)]">
              Free
            </div>
            <div className="mt-2 text-3xl font-extrabold text-[color:var(--color-dark-gray)]">
              ₪0
            </div>
            <ul className="mt-4 space-y-2 text-[color:var(--color-gray-blue)]">
              <li>• 1–2 интервью</li>
              <li>• Базовая аналитика</li>
              <li>• Без карты</li>
            </ul>
            <Button
              onClick={onOpenSignup}
              variant="outline"
              className="mt-6 w-full"
            >
              Начать
            </Button>
          </div>

          {/* Pro */}
          <div
            className="
              relative rounded-3xl p-6 shadow-xl transition
              bg-[color:var(--color-white)]
              border-2 border-[color:var(--color-yellow)]
              hover:shadow-2xl
            "
          >
            <div className="text-sm font-semibold text-[color:var(--color-deep-blue)]">
              Pro
            </div>
            <div className="mt-2 text-3xl font-extrabold text-[color:var(--color-dark-gray)]">
              ₪10/мес
            </div>
            <ul className="mt-4 space-y-2 text-[color:var(--color-gray-blue)]">
              <li>• 10–20 интервью</li>
              <li>• Расширенная аналитика</li>
              <li>• Экспорт рекомендаций</li>
            </ul>
            <Button
              onClick={onOpenSignup}
              variant="primary"
              className="mt-6 w-full"
            >
              Оформить
            </Button>
          </div>

          {/* Yearly */}
          <div
            className="
              card p-6 transition
              border border-[color:var(--color-light-blue)]/40
              hover:shadow-md hover:border-[color:var(--color-deep-blue)]/40
            "
          >
            <div className="text-sm font-semibold text-[color:var(--color-deep-blue)]">
              Yearly
            </div>
            <div className="mt-2 text-3xl font-extrabold text-[color:var(--color-dark-gray)]">
              ₪100/год
            </div>
            <ul className="mt-4 space-y-2 text-[color:var(--color-gray-blue)]">
              <li>• Всё из Pro</li>
              <li>• Экономия до 30%</li>
              <li>• Приоритет поддержки</li>
            </ul>
            <Button
              onClick={onOpenSignup}
              variant="outline"
              className="mt-6 w-full"
            >
              Купить
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
