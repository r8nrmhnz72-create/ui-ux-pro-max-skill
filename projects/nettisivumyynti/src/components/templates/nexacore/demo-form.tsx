"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, Clock, Loader2, Mail, Sparkles } from "lucide-react";

import { GradientText } from "./primitives";

const field =
  "mt-2 w-full rounded-xl bg-white px-4 py-3 text-base text-[var(--nexa-navy)] ring-1 ring-[var(--border)] placeholder:text-[var(--nexa-lavender)] focus:outline-none focus:ring-2 focus:ring-[var(--nexa-blue)]";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "done"; email: string } | { kind: "error"; message: string };

const STEPS = [
  { icon: Sparkles, text: "Kerro yrityksestäsi ja toiveistasi" },
  { icon: Clock, text: "Rakennamme demon muutamassa minuutissa" },
  { icon: Mail, text: "Saat linkin sähköpostiisi" },
];

export function DemoForm({ prefill = "", prefillKey = 0 }: { prefill?: string; prefillKey?: number }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!prefillKey) return;
    setDescription(prefill);
    setStatus({ kind: "idle" });
  }, [prefill, prefillKey]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      company: form.get("company"),
      industry: form.get("industry"),
      description,
      website: form.get("website"),
      consent: form.get("consent") === "on",
    };
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setStatus({ kind: "done", email: String(payload.email) });
      } else {
        setStatus({ kind: "error", message: data.error ?? "Lähetys epäonnistui. Yritä hetken päästä uudelleen." });
      }
    } catch {
      setStatus({ kind: "error", message: "Yhteys katkesi. Tarkista verkkoyhteys ja yritä uudelleen." });
    }
  }

  return (
    <section
      id="demo"
      className="scroll-mt-24 bg-[var(--nexa-chip)]"
      style={{ padding: "clamp(64px, 8vw, 120px) clamp(16px, 4vw, 40px)" }}
    >
      <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <div className="flex flex-col gap-6">
          <h2
            className="font-medium text-balance text-[var(--nexa-navy)]"
            style={{ fontSize: "clamp(30px, 3.6vw, 48px)", lineHeight: 1.15 }}
          >
            Ilmainen demosivusto
            <br />
            <GradientText>sähköpostiisi.</GradientText>
          </h2>
          <p className="text-[var(--nexa-lavender-3)]" style={{ fontSize: "clamp(15px, 1.2vw, 19px)" }}>
            Kerro, millaisen sivuston haluat. Teemme siitä demon ja lähetämme linkin sinulle, yleensä alle
            viidessä minuutissa. Demo on maksuton eikä sido sinua mihinkään.
          </p>
          <ol className="flex flex-col gap-3">
            {STEPS.map(({ icon: Icon, text }) => (
              <li key={text} className="nexa-soft-shadow flex items-center gap-3 rounded-[18px] bg-white px-5 py-4 text-[var(--nexa-navy)]">
                <Icon className="h-5 w-5 shrink-0 text-[var(--nexa-blue)]" aria-hidden />
                {text}
              </li>
            ))}
          </ol>
        </div>

        <div className="nexa-soft-shadow rounded-[28px] bg-white p-6 text-[var(--nexa-navy)] sm:p-8">
          {status.kind === "done" ? (
            <div role="status" className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-[var(--nexa-blue)]" aria-hidden />
              <h3 className="mt-4 text-xl font-semibold">Demo on tekeillä!</h3>
              <p className="mt-2 max-w-sm text-[var(--nexa-lavender-3)]">
                Lähetämme linkin osoitteeseen <strong className="text-[var(--nexa-navy)]">{status.email}</strong> muutaman
                minuutin kuluessa. Tarkista tarvittaessa myös roskapostikansio.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label htmlFor="demo-name" className="text-sm font-medium">
                  Nimi
                  <input id="demo-name" name="name" required maxLength={100} autoComplete="name" className={field} placeholder="Maija Mallikas" />
                </label>
                <label htmlFor="demo-email" className="text-sm font-medium">
                  Sähköposti
                  <input id="demo-email" name="email" type="email" required maxLength={200} autoComplete="email" className={field} placeholder="maija@yritys.fi" />
                </label>
                <label htmlFor="demo-company" className="text-sm font-medium">
                  Yrityksen nimi
                  <input id="demo-company" name="company" required maxLength={120} autoComplete="organization" className={field} placeholder="Parturi Saksi" />
                </label>
                <label htmlFor="demo-industry" className="text-sm font-medium">
                  Toimiala <span className="font-normal text-[var(--nexa-lavender-3)]">(valinnainen)</span>
                  <input id="demo-industry" name="industry" maxLength={120} className={field} placeholder="Parturi-kampaamo" />
                </label>
              </div>
              <label htmlFor="demo-description" className="text-sm font-medium">
                Millaisen sivuston haluat?
                <textarea
                  id="demo-description"
                  name="description"
                  required
                  minLength={20}
                  maxLength={2000}
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={field}
                  placeholder="Esim. palvelut ja hinnat, ajanvaraus, värit joista pidät, sivustot joista pidät..."
                />
              </label>
              {/* Honeypot for bots: hidden from people and screen readers. */}
              <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor="demo-website">Verkkosivu</label>
                <input id="demo-website" name="website" tabIndex={-1} autoComplete="off" />
              </div>
              <label htmlFor="demo-consent" className="flex items-start gap-3 text-sm text-[var(--nexa-lavender-3)]">
                <input id="demo-consent" name="consent" type="checkbox" required className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--nexa-blue)]" />
                Hyväksyn, että tietojani käytetään demon tekemiseen ja yhteydenottoon. Demon tekemisessä käytetään tekoälyä.
              </label>
              {status.kind === "error" ? (
                <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {status.message}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={status.kind === "sending"}
                className="nexa-grad-a-bg flex cursor-pointer items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-70"
              >
                {status.kind === "sending" ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : null}
                {status.kind === "sending" ? "Lähetetään..." : "Tee minulle ilmainen demo"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
