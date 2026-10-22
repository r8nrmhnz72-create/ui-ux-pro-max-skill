import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";

import { Logo } from "./primitives";

const COLUMNS = [
  {
    title: "Palvelut",
    links: [
      { label: "Kotisivut", href: "#hinnat" },
      { label: "Verkkokaupat", href: "#hinnat" },
      { label: "Ylläpito", href: "#hinnat" },
      { label: "Ilmainen demo", href: "#kuvaile" },
    ],
  },
  {
    title: "Sivuseppä",
    links: [
      { label: "Työnäytteet", href: "#tyot" },
      { label: "Prosessi", href: "#thinking" },
      { label: "Usein kysyttyä", href: "#ukk" },
      { label: "Yhteydenotto", href: "#yhteys" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[var(--nexa-ink)] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(50% 60% at 15% 0%, rgba(28,78,255,.22), transparent 70%), radial-gradient(40% 50% at 95% 100%, rgba(172,36,255,.2), transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-[1200px] px-4 pt-16 pb-8 sm:px-6 lg:pt-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div className="col-span-2 lg:col-span-1">
            <a href="#home" className="inline-flex items-center gap-2" aria-label="Sivuseppä – takaisin alkuun">
              <Logo />
              <span className="text-xl font-semibold tracking-[-0.02em]">Sivuseppä</span>
            </a>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-[var(--nexa-lavender-2)]">
              Nopeita ja myyviä nettisivuja suomalaisille yrityksille. Kiinteä hinta, sovittu aikataulu ja tuki suomeksi.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-white/55">{col.title}</p>
              <ul className="mt-4 space-y-1">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="inline-flex min-h-10 items-center text-[15px] text-white/85 transition-colors hover:text-white">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="col-span-2 lg:col-span-1">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-white/55">Yhteystiedot</p>
            <ul className="mt-4 space-y-3 text-[15px] text-white/85">
              <li className="flex items-center gap-3">
                <Phone className="size-4 text-[var(--nexa-accent)]" aria-hidden />
                <a href="tel:+358401234567" className="select-all hover:text-white">040 123 4567</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 text-[var(--nexa-accent)]" aria-hidden />
                <a href="mailto:moi@sivuseppa.fi" className="select-all hover:text-white">moi@sivuseppa.fi</a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="size-4 text-[var(--nexa-accent)]" aria-hidden />
                Helsinki, palvelemme koko Suomea
              </li>
            </ul>
          </div>
        </div>

        <p
          aria-hidden
          className="mt-16 select-none text-center font-semibold leading-none tracking-[-0.06em]"
          style={{
            fontSize: "clamp(56px, 15.5vw, 216px)",
            backgroundImage: "linear-gradient(180deg, rgba(255,255,255,.16), rgba(255,255,255,0) 85%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Sivuseppä
        </p>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Sivuseppä Oy · Y-tunnus 1234567-8</p>
          <a href="#home" className="inline-flex min-h-10 items-center gap-2 text-white/75 transition-colors hover:text-white">
            Takaisin ylös
            <ArrowUp className="size-4" aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}
