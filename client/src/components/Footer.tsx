import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-[color:var(--color-light-blue)]/60 bg-[color:var(--color-white)]">
      <div className="section py-8 text-sm [color:var(--color-gray-blue)]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} SkillDrill. All rights reserved.</p>
          <div className="flex gap-5">
            <Link
              to="/privacy"
              className="hover:[color:var(--color-deep-blue)] transition-colors"
            >
              Политика конфиденциальности
            </Link>
            <Link
              to="/terms"
              className="hover:[color:var(--color-deep-blue)] transition-colors"
            >
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
