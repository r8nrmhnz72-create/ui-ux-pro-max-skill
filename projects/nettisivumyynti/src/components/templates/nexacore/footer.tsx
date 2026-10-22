import { Logo } from "./primitives";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-white px-4 py-10">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 text-sm text-[var(--nexa-lavender-3)] sm:flex-row">
        <span className="flex items-center gap-2 text-lg font-medium text-[var(--nexa-navy)]">
          <Logo />
          Sivuseppä
        </span>
        <p className="text-center sm:text-left">© {new Date().getFullYear()} Sivuseppä Oy · Y-tunnus 1234567-8 · Helsinki</p>
      </div>
    </footer>
  );
}
