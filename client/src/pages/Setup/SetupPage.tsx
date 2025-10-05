// client/src/pages/Setup/SetupPage.tsx
import { Outlet, useNavigate } from "react-router-dom";
import { FormProvider } from "react-hook-form";
import { useSetupForm } from "../../features/setup/useSetupForm";
import Section from "../../components/ui/Section";
import Card from "../../components/ui/Card";

export default function SetupPage() {
  const nav = useNavigate();
  const form = useSetupForm();

  // Централизованная навигация между шагами
  function go(to: string) {
    nav(to);
  }

  return (
    <Section className="max-w-3xl">
      <h1 className="mb-4 text-2xl md:text-3xl font-semibold text-brand-deep dark:text-brand-white">
        Мастер настройки
      </h1>

      <FormProvider {...form}>
        {/* Шаги сами рисуют поля и кнопки; здесь только каркас */}
        <Card className="p-4 md:p-6">
          <Outlet context={{ go }} />
        </Card>
      </FormProvider>
    </Section>
  );
}
