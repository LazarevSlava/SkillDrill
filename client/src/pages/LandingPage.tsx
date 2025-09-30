import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/sections/Header";
import Main from "../components/sections/Main";
import Footer from "../components/sections/Footer";
import Modal from "../components/ui/Modal";
import RegisterForm from "../forms/RegisterForm";
import Button from "../components/ui/Button";

export default function LandingPage() {
  const [openSignup, setOpenSignup] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const navigate = useNavigate();

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
        />
        <p className="mt-3 text-center text-sm text-[color:var(--color-gray-blue)]">
          Уже есть аккаунт?{" "}
          <Button
            variant="link"
            size="sm"
            onClick={() => {
              setOpenSignup(false);
              setOpenLogin(true);
            }}
            className="align-baseline"
          >
            Войти
          </Button>
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
        />
        <p className="mt-3 text-center text-sm text-[color:var(--color-gray-blue)]">
          Нет аккаунта?{" "}
          <Button
            variant="link"
            size="sm"
            onClick={() => {
              setOpenLogin(false);
              setOpenSignup(true);
            }}
            className="align-baseline"
          >
            Зарегистрироваться
          </Button>
        </p>
      </Modal>
    </div>
  );
}
