import { Outlet, NavLink } from "react-router-dom";

const steps = [
  { to: "/setup/topics", label: "Topics & Skills" },
  { to: "/setup/session", label: "Session" },
  { to: "/setup/preferences", label: "Preferences" },
  { to: "/setup/review", label: "Review" },
];

export default function SetupPage() {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1
        className="text-2xl font-semibold mb-4"
        style={{ color: "var(--color-deep-blue)" }}
      >
        SkillDrill-мастер настройки
      </h1>
      <ol className="flex gap-2 mb-6">
        {steps.map((s) => (
          <li key={s.to}>
            <NavLink
              to={s.to}
              className={({ isActive }) =>
                `px-3 py-1 rounded-2xl border ${isActive ? "bg-gray-100" : ""}`
              }
            >
              {s.label}
            </NavLink>
          </li>
        ))}
      </ol>
      <div className="rounded-2xl border p-4 bg-white shadow-sm">
        <Outlet />
      </div>
    </div>
  );
}
