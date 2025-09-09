import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import Pricing from "../components/Pricing";
import FAQ from "../components/FAQ";
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

      <main>
        <Hero onOpenSignup={() => setOpenSignup(true)} />
        <HowItWorks />
        <Features />
        <Pricing onOpenSignup={() => setOpenSignup(true)} />
        <FAQ />

        <section className="bg-gradient-to-r from-[var(--color-deep-blue)] to-[var(--color-gray-blue)]">
          <div className="section text-center text-white">
            <h3 className="text-3xl font-bold">
              Готов улучшить шансы на оффер?
            </h3>
            <p className="mt-2 opacity-90">
              Запусти первое интервью — займёт 15 минут.
            </p>
            <button
              onClick={() => setOpenSignup(true)}
              className="btn btn-primary mt-6"
            >
              Начать бесплатно
            </button>
          </div>
        </section>
      </main>

      <Footer />

      <Modal
        open={openSignup}
        onClose={() => setOpenSignup(false)}
        title="Создать аккаунт"
      >
        <RegisterForm
          onSuccess={() => {
            setOpenSignup(false);
            location.href = "/app";
          }}
        />
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

      <Modal open={openLogin} onClose={() => setOpenLogin(false)} title="Войти">
        <RegisterForm
          mode="signup"
          onSuccess={() => {
            setOpenLogin(false);
            location.href = "/app";
          }}
        />
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
