import Button from "../ui/Button";

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
          <Button
            type="button"
            onClick={onOpenLogin}
            variant="ghost"
            className="
              rounded-xl px-4 py-2
              [color:var(--color-deep-blue)]
              hover:bg-[color:var(--color-light-blue)]/30
              focus:ring-[color:var(--color-light-blue)]/50
            "
          >
            Войти
          </Button>

          <Button type="button" onClick={onOpenSignup} variant="primary">
            Зарегистрироваться
          </Button>
        </div>
      </div>
    </header>
  );
}
