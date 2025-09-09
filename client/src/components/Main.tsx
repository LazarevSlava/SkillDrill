// src/components/Main.tsx
import { useState } from "react";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import Features from "./Features";
import Pricing from "./Pricing";
import FAQ from "./FAQ";
import Modal from "./Modal";
import RegisterForm from "../forms/RegisterForm";

export default function Main() {
  const [openSignup, setOpenSignup] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);

  return (
    <main className="bg-[var(--color-white)] text-[var(--color-dark-gray)]">
      {/* Контент лендинга */}
      <Hero onOpenSignup={() => setOpenSignup(true)} />
      <HowItWorks />
      <Features />
      <Pricing onOpenSignup={() => setOpenSignup(true)} />
      <FAQ />

      {/* Финальный CTA */}
      <section className="bg-gradient-to-r from-[var(--color-deep-blue)] to-[var(--color-gray-blue)]">
        <div className="section text-center text-white">
          <h3 className="text-3xl font-bold">Готов улучшить шансы на оффер?</h3>
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

      {/* Модалки аутентификации */}
      <Modal
        open={openSignup}
        onClose={() => setOpenSignup(false)}
        title="Создать аккаунт"
      >
        {/* Если твой RegisterForm поддерживает onSuccess/mode — раскомментируй: */}
        {/* <RegisterForm mode="signup" onSuccess={() => { setOpenSignup(false); location.href = "/app"; }} /> */}
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
    </main>
  );
}
