"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Mail, Phone } from "lucide-react";

import { GradientText } from "./primitives";

const field =
  "mt-2 w-full rounded-xl bg-white px-4 py-3 text-base text-[var(--nexa-navy)] ring-1 ring-[var(--border)] placeholder:text-[var(--nexa-lavender)] focus:outline-none focus:ring-2 focus:ring-[var(--nexa-blue)]";

export function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Connect to a backend or form service (e.g. Formspree) before going live.
    setSent(true);
  }

  return (
    <section
      id="yhteys"
      className="scroll-mt-24 bg-white"
      style={{ padding: "clamp(64px, 8vw, 120px) clamp(16px, 4vw, 40px)" }}
    >
      <div className="relative mx-auto grid max-w-[1200px] gap-10 overflow-hidden rounded-[36px] bg-[var(--nexa-card-dark)] p-8 text-white sm:p-12 lg:grid-cols-2">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 60% at 0% 0%, rgba(28,78,255,.45), transparent 70%), radial-gradient(60% 60% at 100% 100%, rgba(200,111,255,.35), transparent 70%)",
          }}
        />
        <div className="relative">
          <h2 className="font-medium text-balance" style={{ fontSize: "clamp(30px, 3.6vw, 48px)", lineHeight: 1.15 }}>
            Pyydä ilmainen tarjous.
            <br />
            <GradientText>Vastaamme päivässä.</GradientText>
          </h2>
          <p className="mt-5 text-[var(--nexa-lavender-2)]">
            Kerro lyhyesti yrityksestäsi ja tarpeistasi. Tarjous ei sido sinua mihinkään.
          </p>
          <ul className="mt-8 space-y-4 text-white/90">
            <li className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-[var(--nexa-accent)]" aria-hidden />
              <a href="tel:+358401234567" className="select-all hover:text-white">040 123 4567</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-[var(--nexa-accent)]" aria-hidden />
              <a href="mailto:moi@sivuseppa.fi" className="select-all hover:text-white">moi@sivuseppa.fi</a>
            </li>
          </ul>
        </div>

        <div className="relative rounded-[24px] bg-white p-6 text-[var(--nexa-navy)] sm:p-8">
          {sent ? (
            <div role="status" className="flex h-full flex-col items-center justify-center py-10 text-center">
              <CheckCircle2 className="h-12 w-12 text-[var(--nexa-blue)]" aria-hidden />
              <h3 className="mt-4 text-xl font-semibold">Kiitos viestistäsi!</h3>
              <p className="mt-2 text-[var(--nexa-lavender-3)]">Otamme sinuun yhteyttä yhden arkipäivän sisällä.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label htmlFor="nc-name" className="text-sm font-medium">
                  Nimi
                  <input id="nc-name" name="name" required autoComplete="name" className={field} placeholder="Matti Meikäläinen" />
                </label>
                <label htmlFor="nc-email" className="text-sm font-medium">
                  Sähköposti
                  <input id="nc-email" name="email" type="email" required autoComplete="email" className={field} placeholder="matti@yritys.fi" />
                </label>
              </div>
              <label htmlFor="nc-plan" className="text-sm font-medium">
                Paketti
                <select id="nc-plan" name="plan" className={field} defaultValue="Yritys">
                  <option>Startti</option>
                  <option>Yritys</option>
                  <option>Verkkokauppa</option>
                  <option>En tiedä vielä</option>
                </select>
              </label>
              <label htmlFor="nc-msg" className="text-sm font-medium">
                Viesti
                <textarea id="nc-msg" name="message" rows={4} className={field} placeholder="Kerro yrityksestäsi ja millaisen sivuston haluat." />
              </label>
              <button
                type="submit"
                className="nexa-grad-a-bg cursor-pointer rounded-xl px-6 py-3.5 text-base font-medium text-white transition-opacity hover:opacity-90"
              >
                Lähetä tarjouspyyntö
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
