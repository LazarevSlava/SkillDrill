import * as React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export default function Modal({ open, onClose, title, children }: Props) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const closeBtnRef = React.useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = React.useState(false);
  const labelledById = React.useId();

  // Блокируем скролл body, когда модалка открыта
  React.useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  // Фокус и ESC
  React.useEffect(() => {
    if (!open) return;

    // маленький enter-эффект для анимации
    const t = requestAnimationFrame(() => setMounted(true));

    // фокус на кнопке закрытия (или первом focusable элементе)
    closeBtnRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // простейший focus trap: если Tab уходит из панели — возвращаем
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<
          | HTMLButtonElement
          | HTMLInputElement
          | HTMLAnchorElement
          | HTMLTextAreaElement
          | HTMLSelectElement
        >(
          'a[href], button:not([disabled]), textarea, input[type="text"], input[type="email"], input[type="password"], input[type="number"], select, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length > 0) {
          const first = focusables[0] as HTMLElement;
          const last = focusables[focusables.length - 1] as HTMLElement;
          const active = document.activeElement as HTMLElement | null;

          if (e.shiftKey && active === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(t);
      setMounted(false);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledById}
    >
      {/* Backdrop */}
      <button
        aria-label="Закрыть модальное окно"
        onClick={onClose}
        className={[
          "absolute inset-0 bg-black/50 transition-opacity",
          mounted ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={[
          "relative z-10 w-full max-w-md rounded-2xl p-6 shadow-2xl",
          "bg-[color:var(--color-white)]",
          "ring-1 ring-[color:var(--color-light-blue)]/20",
          "transition-all duration-200",
          mounted
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-2 scale-[0.98]",
        ].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3
            id={labelledById}
            className="text-xl font-semibold text-[color:var(--color-deep-blue)]"
          >
            {title}
          </h3>
          <button
            ref={closeBtnRef}
            aria-label="Закрыть"
            onClick={onClose}
            className="
              rounded-full p-2 transition
              hover:bg-[color:var(--color-light-blue)]/30
              focus:outline-none focus:ring-2 focus:ring-[color:var(--color-light-blue)]/50
              text-[color:var(--color-dark-gray)]
            "
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              aria-hidden="true"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 11-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
