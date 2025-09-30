// src/pages/LandingPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/sections/Header";
import Main from "../components/sections/Main";
import Footer from "../components/sections/Footer";
import Modal from "../components/ui/Modal";
import RegisterForm from "../forms/RegisterForm";

export default function LandingPage() {
  const [openSignup, setOpenSignup] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const navigate = useNavigate();

  // Если твой Modal уже сам блокирует скролл body на время открытия,
  // этот эффект можно удалить, чтобы не дублировать.
  useEffect(() => {
    document.body.style.overflow = openSignup || openLogin ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openSignup, openLogin]);

  const goApp = () => navigate("/app");

  return (
    <div className="min-h-screen bg-[color:var(--color-white)] text-[color:var(--color-dark-gray)]">
      <Header
        onOpenSignup={() => setOpenSignup(true)}
        onOpenLogin={() => setOpenLogin(true)}
      />

      {/* ВАЖНО: у Main больше нет onOpenLogin в пропсах */}
      <Main onOpenSignup={() => setOpenSignup(true)} />

      <Footer />

      {/* Signup */}
      <Modal
        open={openSignup}
        onClose={() => setOpenSignup(false)}
        title="Создать аккаунт"
      >
        <RegisterForm
          mode="signup"
          onSuccess={() => {
            setOpenSignup(false);
            goApp();
          }}
          // showBottomToggle={false} // по умолчанию и так скрыт
        />
        <p className="mt-3 text-center text-sm text-[color:var(--color-gray-blue)]">
          Уже есть аккаунт?{" "}
          <button
            onClick={() => {
              setOpenSignup(false);
              setOpenLogin(true);
            }}
            className="font-semibold underline text-[color:var(--color-deep-blue)]"
          >
            Войти
          </button>
        </p>
      </Modal>

      {/* Login */}
      <Modal open={openLogin} onClose={() => setOpenLogin(false)} title="Войти">
        <RegisterForm
          mode="signin"
          onSuccess={() => {
            setOpenLogin(false);
            goApp();
          }}
          // showBottomToggle={false}
        />
        <p className="mt-3 text-center text-sm text-[color:var(--color-gray-blue)]">
          Нет аккаунта?{" "}
          <button
            onClick={() => {
              setOpenLogin(false);
              setOpenSignup(true);
            }}
            className="font-semibold underline text-[color:var(--color-deep-blue)]"
          >
            Зарегистрироваться
          </button>
        </p>
      </Modal>
    </div>
  );
}
