import { useState } from "react";
import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import RegisterForm from "../forms/RegisterForm";

export default function LandingPage() {
  const [openSignup, setOpenSignup] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-white)] text-[var(--color-dark-gray)]">
      <Header
        onOpenSignup={() => setOpenSignup(true)}
        onOpenLogin={() => setOpenLogin(true)}
      />

      <Main
        onOpenSignup={() => setOpenSignup(true)}
        onOpenLogin={() => setOpenLogin(true)}
      />

      <Footer />

      {/* Signup */}
      <Modal
        open={openSignup}
        onClose={() => setOpenSignup(false)}
        title="Создать аккаунт"
      >
        {/* Если твоя форма поддерживает onSuccess/mode — можно так: 
            <RegisterForm mode="signup" onSuccess={() => { setOpenSignup(false); location.href = "/app"; }} /> */}
        <RegisterForm />
        <p
          className="mt-3 text-center text-sm"
          style={{ color: "var(--color-gray-blue)" }}
        >
          Уже есть аккаунт?{" "}
          <button
            onClick={() => {
              setOpenSignup(false);
              setOpenLogin(true);
            }}
            className="underline font-semibold text-[var(--color-deep-blue)]"
          >
            Войти
          </button>
        </p>
      </Modal>

      {/* Login */}
      <Modal open={openLogin} onClose={() => setOpenLogin(false)} title="Войти">
        {/* <RegisterForm mode="login" onSuccess={() => { setOpenLogin(false); location.href = "/app"; }} /> */}
        <RegisterForm />
        <p
          className="mt-3 text-center text-sm"
          style={{ color: "var(--color-gray-blue)" }}
        >
          Нет аккаунта?{" "}
          <button
            onClick={() => {
              setOpenLogin(false);
              setOpenSignup(true);
            }}
            className="underline font-semibold text-[var(--color-deep-blue)]"
          >
            Зарегистрироваться
          </button>
        </p>
      </Modal>
    </div>
  );
}
