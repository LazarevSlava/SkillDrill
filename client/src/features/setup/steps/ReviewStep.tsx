// client/src/pages/Setup/Steps/ReviewStep.tsx
import { useFormContext } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import type { SetupFormInput } from "../../../features/setup/useSetupForm";
import { finalizeSetup } from "../../../features/setup/useSetupForm"; // markSetupCompleted + clearSetupDraft
import Button from "../../../components/ui/Button";

export default function ReviewStep() {
  // Контекст формы соответствует провайдеру: <SetupFormInput>
  const { getValues, handleSubmit } = useFormContext<SetupFormInput>();
  const nav = useNavigate();

  const v = getValues(); // снимок текущих значений формы (input-вид)

  const onSubmit = handleSubmit(() => {
    // тут можно сделать реальный POST /api/setup при необходимости
    finalizeSetup();
    nav("/dashboard");
  });

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <h2 className="text-lg md:text-xl font-semibold text-brand-deep dark:text-brand-white">
        Проверь настройки
      </h2>

      <ul className="text-sm text-brand-dark dark:text-neutral-300 space-y-1">
        <li>
          <b>Темы:</b> {v.topics?.length ? v.topics.join(", ") : "—"}
        </li>
        <li>
          <b>Длительность:</b> {v.duration} мин
        </li>
        <li>
          <b>Сложность:</b> {v.level}
        </li>
        <li>
          <b>Позиция:</b> {v.position}
        </li>
        <li>
          <b>Обращение:</b> {v.tone}
        </li>
        <li>
          <b>Акцент:</b> {v.focus}
        </li>
        <li>
          <b>Голос:</b> {v.voice ? "включён" : "выключен"}
        </li>
      </ul>

      <div className="flex justify-between">
        <Link to="/setup/preferences" className="btn btn-outline">
          ← Назад
        </Link>

        <Button type="submit" variant="primary">
          Сохранить и продолжить → /dashboard
        </Button>
      </div>
    </form>
  );
}
