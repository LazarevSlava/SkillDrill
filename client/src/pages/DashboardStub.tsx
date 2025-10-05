// client/src/pages/DashboardStub.tsx
import Section from "../components/ui/Section";
import Card from "../components/ui/Card";

export default function DashboardStub() {
  return (
    <Section className="max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold text-brand-deep dark:text-brand-white">
        Личный кабинет (заглушка)
      </h1>

      <Card className="mt-4 p-6">
        <p className="text-brand-gray-blue dark:text-neutral-400">
          Здесь скоро появится дашборд: выбор тем, уровней, запуск интервью и
          аналитика.
        </p>
      </Card>
    </Section>
  );
}
