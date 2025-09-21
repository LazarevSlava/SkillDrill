import type { ReactNode, ReactElement } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardStub from "./pages/DashboardStub";
import AuthStub from "./pages/AuthStub";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import SetupPage from "./pages/Setup/SetupPage";
import TopicsStep from "./pages/Setup/Steps/TopicsStep";
import SessionStep from "./pages/Setup/Steps/SessionStep";
import PreferencesStep from "./pages/Setup/Steps/PreferencesStep";
import ReviewStep from "./pages/Setup/Steps/ReviewStep";
import { isSetupCompleted } from "./features/setup/storage";

type Props = { children: ReactNode };
const isAuthed = () => true; // JWT/cookis

// Если не залогинен — уводим на главную
export function RequireAuth({ children }: Props): ReactElement | null {
  if (!isAuthed()) {
    return <Navigate to="/setup" replace />;
  }
  return <>{children}</>;
}

// Если сетап не завершён — направляем в мастер
function OnboardingGate({
  children,
}: {
  children: ReactNode;
}): ReactElement | null {
  const isSetupDone = isSetupCompleted(); // твоя проверка
  if (!isSetupDone) {
    return <Navigate to="/setup" replace />;
  }
  return <>{children}</>;
}

// Если сетап уже завершён — не даём вернуться в мастер
export function SetupOnly({ children }: Props): ReactElement | null {
  if (isSetupCompleted()) {
    return <Navigate to="/app" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/app"
        element={
          <RequireAuth>
            <OnboardingGate>
              <DashboardStub />
            </OnboardingGate>
          </RequireAuth>
        }
      />
      <Route
        path="/setup"
        element={
          <RequireAuth>
            <SetupOnly>
              <SetupPage />
            </SetupOnly>
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="topics" replace />} />
        <Route path="topics" element={<TopicsStep />} />
        <Route path="session" element={<SessionStep />} />
        <Route path="preferences" element={<PreferencesStep />} />
        <Route path="review" element={<ReviewStep />} />
      </Route>
      <Route path="/auth/:mode" element={<AuthStub />} />
      {/* 404 */}
      <Route path="*" element={<div className="section">Not Found</div>} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
    </Routes>
  );
}
