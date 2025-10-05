// client/src/pages/Privacy.tsx
import Section from "../components/ui/Section";
import Card from "../components/ui/Card";

export default function Privacy() {
  return (
    <Section className="max-w-3xl py-12">
      <Card className="p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-deep dark:text-brand-white">
          Политика конфиденциальности
        </h1>
        <p className="mt-2 text-sm text-brand-gray-blue dark:text-neutral-400">
          Последнее обновление:{" "}
          <time dateTime="2025-09-10">10 сентября 2025</time>
        </p>

        <div className="mt-8 space-y-6 text-brand-dark dark:text-neutral-300">
          <p>
            В SkillDrill мы уважаем вашу конфиденциальность. Эта политика
            описывает, какие данные мы собираем, как используем и как вы можете
            управлять ими.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-brand-deep dark:text-brand-white">
              1. Какие данные мы собираем
            </h2>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Аккаунт: email, имя (если указано)</li>
              <li>Технические: IP, device, cookies</li>
              <li>Продуктовые: сессии интервью, ответы, прогресс</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-brand-deep dark:text-brand-white">
              2. Как используем
            </h2>
            <p className="mt-2">
              Для предоставления сервиса, аналитики, улучшений, поддержки,
              соблюдения требований закона.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-brand-deep dark:text-brand-white">
              3. С кем делимся
            </h2>
            <p className="mt-2">
              С инфраструктурными провайдерами (хостинг/аналитика), только по
              необходимости и по договорам.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-brand-deep dark:text-brand-white">
              4. Хранение и безопасность
            </h2>
            <p className="mt-2">
              Данные хранятся в облаке; применяем шифрование «в покое» и «в
              транзите», RBAC, журналирование.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-brand-deep dark:text-brand-white">
              5. Ваши права
            </h2>
            <p className="mt-2">
              Доступ, исправление, удаление, отзыв согласия на обработку.
              Запросы:{" "}
              <span className="font-medium">support@skilldrill.app</span>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-brand-deep dark:text-brand-white">
              6. Cookies
            </h2>
            <p className="mt-2">
              Используем функциональные и аналитические cookies. Управление —
              через настройки браузера/баннер.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-brand-deep dark:text-brand-white">
              7. Контакты
            </h2>
            <p className="mt-2">Email: support@skilldrill.app</p>
          </section>
        </div>
      </Card>
    </Section>
  );
}
