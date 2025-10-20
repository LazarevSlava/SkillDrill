import type { ReactNode, ReactElement } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import AuthStub from "./pages/AuthStub";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

import SetupPage from "./pages/Setup/SetupPage";
import TopicsStep from "./features/setup/steps/TopicsStep";
import SessionStep from "./features/setup/steps/SessionStep";
import PreferencesStep from "./features/setup/steps/PreferencesStep";
import ReviewStep from "./features/setup/steps/ReviewStep";

import { isSetupCompleted } from "./features/setup/storage";

// Заглушка авторизации (позже заменим на реальную проверку JWT/куки)
const isAuthed = () => true;

// ----- layout с фоном/темой/базовой типографикой -----
function RootLayout(): ReactElement {
  // app-bg — наши фоновые градиенты из components.css
  // min-h-dvh — тянем фон на всю высоту вьюпорта
  // text-brand-dark / dark:text-brand-white — базовый цвет текста из токенов
  return (
    <div className="app-bg min-h-dvh text-brand-dark dark:text-brand-white">
      <Outlet />
    </div>
  );
}

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

// --- App Router ---
export default function App(): ReactElement {
  return (
    <Routes>
      {/* общий лэйаут с нашей фоновой заливкой и цветами */}
      <Route element={<RootLayout />}>
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
              <DashboardPage />
            </RequireAuth>
          }
        />

        {/* Прочие страницы */}
        <Route path="/auth/:mode" element={<AuthStub />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* 404 → на главную */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
