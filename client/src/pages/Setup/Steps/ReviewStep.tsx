// client/src/pages/Setup/Steps/ReviewStep.tsx
import { useNavigate, Link } from "react-router-dom";
import { useSetupForm } from "../../../features/setup/useSetupForm";
import {
  clearSetupDraft,
  markSetupCompleted,
} from "../../../features/setup/storage";

export default function ReviewStep() {
  const { values } = useSetupForm();
  const nav = useNavigate();

  function finish() {
    // TODO: позже заменить на POST /api/setup
    markSetupCompleted();
    clearSetupDraft();
    nav("/dashboard");
  }

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-lg">Проверка настроек</h2>
      <pre className="bg-gray-50 p-3 rounded-lg text-sm overflow-auto">
        {JSON.stringify(values, null, 2)}
      </pre>

      <div className="flex justify-between">
        <Link to="/setup/preferences" className="px-4 py-2 rounded-lg border">
          Назад
        </Link>
        <button
          onClick={finish}
          className="px-4 py-2 rounded-lg border bg-yellow-200"
        >
          Start interview (→ пока /dashboard)
        </button>
      </div>
    </div>
  );
}
