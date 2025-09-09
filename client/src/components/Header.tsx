type HeaderProps = {
  onOpenSignup: () => void;
  onOpenLogin: () => void;
};

export default function Header({ onOpenSignup, onOpenLogin }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[var(--color-white)]/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-deep-blue)] text-white shadow">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5a1 1 0 10-2 0v4.382l-2.447 2.447a1 1 0 101.414 1.414L12 12.414l2.033 2.033a1 1 0 101.414-1.414L13 11.382V7z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-[var(--color-deep-blue)]">
            SkillDrill
          </span>
        </div>

        <nav className="hidden items-center gap-6 text-[var(--color-dark-gray)] md:flex">
          <a href="#how" className="hover:text-[var(--color-deep-blue)]">
            Как это работает
          </a>
          <a href="#features" className="hover:text-[var(--color-deep-blue)]">
            Возможности
          </a>
          <a href="#pricing" className="hover:text-[var(--color-deep-blue)]">
            Тарифы
          </a>
          <a href="#faq" className="hover:text-[var(--color-deep-blue)]">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenLogin}
            className="rounded-xl px-4 py-2 font-medium text-[var(--color-deep-blue)] hover:bg-[var(--color-light-blue)]/30"
          >
            Войти
          </button>
          <button onClick={onOpenSignup} className="btn btn-primary">
            Зарегистрироваться
          </button>
        </div>
      </div>
    </header>
  );
}
