export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-light-blue)]/60 bg-[var(--color-white)]">
      <div
        className="section py-8 text-sm"
        style={{ color: "var(--color-gray-blue)" }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} SkillDrill. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-[var(--color-deep-blue)]">
              Политика конфиденциальности
            </a>
            <a href="#" className="hover:text-[var(--color-deep-blue)]">
              Условия использования
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
