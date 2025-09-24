type HeaderProps = {
  onOpenSignup: () => void;
  onOpenLogin: () => void;
};

export default function Header({ onOpenSignup, onOpenLogin }: HeaderProps) {
  return (
    <header
      className="
        sticky top-0 z-40
        border-b border-[color:var(--color-light-blue)]/40
        bg-[color:var(--color-white)]/80 backdrop-blur
        supports-[backdrop-filter]:bg-[color:var(--color-white)]/60
      "
      aria-label="Site header"
    >
      <div className="section flex items-center justify-between py-3">
        <a href="/" className="flex items-center gap-3">
          {/* <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--color-deep-blue)] [color:white] shadow">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              aria-hidden="true"
              fill="currentColor"
            >
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5a1 1 0 10-2 0v4.382l-2.447 2.447a1 1 0 101.414 1.414L12 12.414l2.033 2.033a1 1 0 101.414-1.414L13 11.382V7z" />
            </svg>
          </div> */}
          <img
            src="../../public/icons/skilldrill_icon_64x64.png"
            alt="SkillDrill logo"
            className="h-9 w-9 rounded-xl shadow"
          />
          <span className="text-lg font-bold [color:var(--color-deep-blue)]">
            SkillDrill
          </span>
        </a>

        <nav
          className="hidden items-center gap-8 text-lg [color:var(--color-dark-gray)] md:flex"
          aria-label="Main"
        >
          <a
            href="#how"
            className="transition-colors hover:[color:var(--color-deep-blue)]"
          >
            Как это работает
          </a>
          <a
            href="#features"
            className="transition-colors hover:[color:var(--color-deep-blue)]"
          >
            Возможности
          </a>
          <a
            href="#pricing"
            className="transition-colors hover:[color:var(--color-deep-blue)]"
          >
            Тарифы
          </a>
          <a
            href="#faq"
            className="transition-colors hover:[color:var(--color-deep-blue)]"
          >
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenLogin}
            className="
              rounded-xl px-4 py-2 font-medium transition-colors
              [color:var(--color-deep-blue)]
              hover:bg-[color:var(--color-light-blue)]/30
              focus:outline-none focus:ring-2 focus:ring-[color:var(--color-light-blue)]/50
            "
          >
            Войти
          </button>

          <button
            type="button"
            onClick={onOpenSignup}
            className="btn btn-primary"
          >
            Зарегистрироваться
          </button>
        </div>
      </div>
    </header>
  );
}
