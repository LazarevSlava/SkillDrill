// client/src/pages/Setup/SetupPage.tsx
import { Outlet, useNavigate } from "react-router-dom";
import { FormProvider } from "react-hook-form";
import { useSetupForm } from "../../features/setup/useSetupForm";

export default function SetupPage() {
  const nav = useNavigate();
  const form = useSetupForm();

  // Навигация по шагам — централизованный хелпер (можно не использовать, см. шаги)
  function go(to: string) {
    nav(to);
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1
        className="text-2xl font-semibold mb-4"
        style={{ color: "var(--color-deep-blue)" }}
      >
        Мастер настройки
      </h1>
      <FormProvider {...form}>
        {/* Шаги сами рисуют поля и кнопки. Тут только каркас и стили. */}
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <Outlet context={{ go }} />
        </div>
      </FormProvider>
    </div>
  );
}
