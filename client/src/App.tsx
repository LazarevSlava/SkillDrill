import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardStub from "./pages/DashboardStub";
import AuthStub from "./pages/AuthStub";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* Заглушка «Личный кабинет» после логина/регистрации */}
      <Route path="/app" element={<DashboardStub />} />
      {/* Заглушки для логина/регистрации (если вдруг хочешь ходить прямо сюда) */}
      <Route path="/auth/:mode" element={<AuthStub />} />
      {/* 404 */}
      <Route path="*" element={<div className="section">Not Found</div>} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
    </Routes>
  );
}
