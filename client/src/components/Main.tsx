import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import Features from "./Features";
import Pricing from "./Pricing";
import FAQ from "./FAQ";

type Props = {
  onOpenSignup: () => void;
  onOpenLogin: () => void;
};

export default function Main({ onOpenSignup }: Props) {
  return (
    <main className="bg-[var(--color-white)] text-[var(--color-dark-gray)]">
      <Hero onOpenSignup={onOpenSignup} />
      <HowItWorks />
      <Features />
      <Pricing onOpenSignup={onOpenSignup} />
      <FAQ />

      <section className="bg-gradient-to-r from-[var(--color-deep-blue)] to-[var(--color-gray-blue)]">
        <div className="mx-auto max-w-7xl px-6 py-14 text-center text-white">
          <h3 className="text-3xl font-bold">Готов улучшить шансы на оффер?</h3>
          <p className="mt-2 opacity-90">
            Запусти первое интервью — займёт 15 минут.
          </p>
          <button onClick={onOpenSignup} className="btn btn-primary mt-6">
            Начать бесплатно
          </button>
        </div>
      </section>
    </main>
  );
}
