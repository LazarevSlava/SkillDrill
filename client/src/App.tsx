import type { ReactNode, ReactElement } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import AuthStub from "./pages/AuthStub";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

// ——— создаём новую сессию (Единственный мастер) ———
import NewSessionPage from "./pages/Setup/NewSessionPage";

// шаги
import TopicsStep from "./features/setup/steps/TopicsStep";
import SessionStep from "./features/setup/steps/SessionStep";
import PreferencesStep from "./features/setup/steps/PreferencesStep";
import ReviewStep from "./features/setup/steps/ReviewStep";
import InterviewPage from "./pages/Interview/InterviewPage";

// Заглушка авторизации (позже заменим на JWT/куки)
const isAuthed = () => true;

// ----- layout -----
function RootLayout(): ReactElement {
  return (
    <div className="app-bg min-h-dvh text-brand-dark dark:text-brand-white">
      <Outlet />
    </div>
  );
}

// --- Guard ---
function RequireAuth({
  children,
}: {
  children: ReactNode;
}): ReactElement | null {
  return isAuthed() ? <>{children}</> : <Navigate to="/" replace />;
}

export default function App(): ReactElement {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/interview" element={<InterviewPage />} />
        <Route
          path="/sessions/new"
          element={
            <RequireAuth>
              <NewSessionPage />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="topics" replace />} />
          <Route path="topics" element={<TopicsStep />} />
          <Route path="session" element={<SessionStep />} />
          <Route path="preferences" element={<PreferencesStep />} />
          <Route path="review" element={<ReviewStep mode="create-session" />} />
        </Route>

        {/* Дэшборд */}
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
