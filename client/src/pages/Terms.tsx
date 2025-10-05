// client/src/pages/Terms.tsx
import Section from "../components/ui/Section";
import Card from "../components/ui/Card";

export default function Terms() {
  return (
    <Section className="max-w-3xl py-12">
      <Card className="p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-deep dark:text-brand-white">
          Условия использования
        </h1>
        <p className="mt-2 text-sm text-brand-gray-blue dark:text-neutral-400">
          Последнее обновление:{" "}
          <time dateTime="2025-09-10">10 сентября 2025</time>
        </p>

        <div className="mt-8 space-y-6 text-brand-dark dark:text-neutral-300">
          <section>
            <h2 className="text-xl font-semibold text-brand-deep dark:text-brand-white">
              1. Принятие условий
            </h2>
            <p className="mt-2">
              Используя SkillDrill, вы соглашаетесь с этими условиями.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-brand-deep dark:text-brand-white">
              2. Аккаунт
            </h2>
            <p className="mt-2">
              Вы отвечаете за конфиденциальность логина/пароля и действия в
              аккаунте.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-brand-deep dark:text-brand-white">
              3. Допустимое использование
            </h2>
            <p className="mt-2">
              Нельзя нарушать закон, пытаться взломать сервис, скрейпить контент
              и т.д.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-brand-deep dark:text-brand-white">
              4. Оплата и тарифы
            </h2>
            <p className="mt-2">
              Бесплатный лимит, затем платные планы; возвраты по политике
              биллинга.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-brand-deep dark:text-brand-white">
              5. Интеллектуальная собственность
            </h2>
            <p className="mt-2">
              Контент и код SkillDrill защищены правом. Запрещено копирование
              без разрешения.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-brand-deep dark:text-brand-white">
              6. Отказ от гарантий
            </h2>
            <p className="mt-2">
              Сервис предоставляется «как есть». Мы стремимся к доступности, но
              SLA не гарантируем.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-brand-deep dark:text-brand-white">
              7. Ограничение ответственности
            </h2>
            <p className="mt-2">
              Мы не отвечаем за косвенные убытки. Ответственность ограничена
              уплаченной суммой за 3 мес.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-brand-deep dark:text-brand-white">
              8. Изменения условий
            </h2>
            <p className="mt-2">
              Мы можем обновлять документ; дата обновления выше. Существенные
              изменения — уведомим.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-brand-deep dark:text-brand-white">
              9. Контакты
            </h2>
            <p className="mt-2">Email: support@skilldrill.app</p>
          </section>
        </div>
      </Card>
    </Section>
  );
}
