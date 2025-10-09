export default function DashboardSidebar() {
  const items = [
    { id: "overview", label: "Обзор", active: true },
    { id: "sessions", label: "Мои сессии" },
    { id: "profile", label: "Профиль" },
    { id: "billing", label: "Подписка и оплата" },
    { id: "settings", label: "Настройки" },
    { id: "logout", label: "Выход" },
  ];

  return (
    <aside className="hidden md:block md:w-64">
      {/* карточка-обёртка: наши токены применяются внутри .card */}
      <div className="card p-5 md:sticky md:top-6 h-[calc(100vh-3rem)] flex flex-col">
        {/* Заголовок и «чип»-подзаголовок — без инлайновых цветов */}
        <header className="pb-2">
          <h2
            className="text-2xl font-extrabold leading-tight"
            style={{ color: "var(--color-deep-blue)" }}
          >
            Панель
          </h2>

          {/* Чип на базе готового .badge, чтобы «Быстрый доступ…» не терялся */}
          <div className="mt-2">
            <span className="badge uppercase tracking-wide text-[10px] font-semibold">
              Быстрый доступ к разделам
            </span>
          </div>
        </header>

        {/* Разделитель с мягким цветом из палитры (через color-mix к нашим токенам) */}
        <hr
          className="my-3 border-0 h-px"
          style={{
            background:
              "color-mix(in oklab, var(--color-light-blue), transparent 70%)",
          }}
        />

        {/* Навигация: базовая типографика задаётся .nav-link; активный пункт подчёркнут и с индикатором слева */}
        <nav className="mt-1 flex-1 flex flex-col gap-1">
          {items.map((it) => (
            <a
              key={it.id}
              href="#"
              className="nav-link rounded-xl px-3 py-2 relative"
              style={
                it.active
                  ? {
                      // мягкий фон активного за счёт наших токенов
                      background:
                        "color-mix(in oklab, var(--color-light-blue), transparent 80%)",
                      fontWeight: 600,
                      textDecoration: "underline",
                    }
                  : undefined
              }
            >
              {/* левый индикатор активного пункта в цвет бренда */}
              {it.active && (
                <span
                  aria-hidden
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r"
                  style={{ backgroundColor: "var(--color-yellow)" }}
                />
              )}
              {it.label}
            </a>
          ))}
        </nav>

        <div
          className="mt-4 text-xs"
          style={{ color: "var(--color-gray-blue)" }}
        >
          © SkillDrill
        </div>
      </div>
    </aside>
  );
}
