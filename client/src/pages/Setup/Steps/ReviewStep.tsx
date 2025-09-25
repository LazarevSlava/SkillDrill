import { useFormContext } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import type { SetupFormInput } from "../../../features/setup/useSetupForm";
import { finalizeSetup } from "../../../features/setup/useSetupForm"; // markSetupCompleted + clearSetupDraft

export default function ReviewStep() {
  // Контекст формы соответствует провайдеру: <SetupFormInput>
  const { getValues, handleSubmit } = useFormContext<SetupFormInput>();
  const nav = useNavigate();

  const v = getValues(); // снимок текущих значений формы (input-вид)

  // Убираем неиспользуемый аргумент, чтобы не ругался no-unused-vars
  const onSubmit = handleSubmit(() => {
    // тут можно сделать реальный POST /api/setup при необходимости
    finalizeSetup();
    nav("/dashboard");
  });

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <h2 className="text-lg font-medium">Проверь настройки</h2>

      <ul className="text-sm text-gray-700 space-y-1">
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
        <Link to="/setup/preferences" className="px-4 py-2 rounded-lg border">
          ← Назад
        </Link>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg border"
          style={{ background: "var(--color-yellow)" }}
        >
          Сохранить и продолжить → /dashboard
        </button>
      </div>
    </form>
  );
}
