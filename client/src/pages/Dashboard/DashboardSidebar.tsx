export default function DashboardSidebar() {
  const items = [
    { id: "overview", label: "Обзор" },
    { id: "sessions", label: "Мои сессии" },
    { id: "profile", label: "Профиль" },
    { id: "billing", label: "Подписка и оплата" },
    { id: "settings", label: "Настройки" },
    { id: "logout", label: "Выход" },
  ];

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col gap-2">
      <div className="card p-4">
        <div className="text-sm text-[color:var(--color-gray-blue)]">
          Навигация
        </div>
        <nav className="mt-3 flex flex-col gap-1">
          {items.map((it) => (
            <a
              key={it.id}
              href="#"
              className="nav-link rounded-xl px-3 py-2 hover:bg-[color:var(--color-light-blue)]/20"
            >
              {it.label}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
