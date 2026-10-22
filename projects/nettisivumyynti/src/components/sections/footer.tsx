export function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-[var(--text-400)] sm:flex-row">
        <img src="/logo.svg" alt="Sivuseppä" width={140} height={40} />
        <p className="text-center sm:text-left">© {new Date().getFullYear()} Sivuseppä Oy · Y-tunnus 1234567-8 · Helsinki</p>
      </div>
    </footer>
  );
}
