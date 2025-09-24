// client/src/App.tsx
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

// Заглушка авторизации (позже заменим на реальную проверку JWT/куки)
const isAuthed = () => true;

// --- Guards ---
function RequireAuth({
  children,
}: {
  children: ReactNode;
}): ReactElement | null {
  return isAuthed() ? <>{children}</> : <Navigate to="/" replace />;
}

function SetupOnly({ children }: { children: ReactNode }): ReactElement | null {
  // Если сетап завершён — ведём на /dashboard
  return isSetupCompleted() ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <>{children}</>
  );
}

function OnboardingGate({
  children,
}: {
  children: ReactNode;
}): ReactElement | null {
  // Если сетап не завершён — ведём в мастер
  return isSetupCompleted() ? (
    <>{children}</>
  ) : (
    <Navigate to="/setup" replace />
  );
}

// --- App Router ---
export default function App(): ReactElement {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      {/* Мастер настройки */}
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

      {/* ЛК после онбординга */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <OnboardingGate>
              <DashboardStub />
            </OnboardingGate>
          </RequireAuth>
        }
      />

      {/* Прочие страницы */}
      <Route path="/auth/:mode" element={<AuthStub />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />

      {/* 404 → на главную */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
