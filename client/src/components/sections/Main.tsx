import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import Features from "./Features";
import Pricing from "./Pricing";
import FAQ from "./FAQ";

type Props = {
  onOpenSignup: () => void;
};

export default function Main({ onOpenSignup }: Props) {
  return (
    <main className="bg-[color:var(--color-white)] text-[color:var(--color-dark-gray)]">
      <Hero onOpenSignup={onOpenSignup} />
      <HowItWorks />
      <Features />
      <Pricing onOpenSignup={onOpenSignup} />
      <FAQ />

      <section className="bg-gradient-to-r from-[color:var(--color-deep-blue)] to-[color:var(--color-gray-blue)]">
        <div className="section py-14 text-center text-white">
          <div className="mx-auto max-w-3xl rounded-2xl bg-white/5 p-8 shadow-sm ring-1 ring-white/10">
            <h3 className="text-3xl font-bold">
              Готов улучшить шансы на оффер?
            </h3>
            <p className="mt-2 opacity-90">
              Запусти первое интервью — займёт 15 минут.
            </p>
            <button
              onClick={onOpenSignup}
              className="btn btn-primary mt-6 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              Начать бесплатно
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
