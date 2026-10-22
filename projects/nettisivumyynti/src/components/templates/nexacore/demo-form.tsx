"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Clock, Download, Loader2, Mail, Maximize2, Minimize2, Sparkles, Square } from "lucide-react";

import { getDownloads, getSample, isSampleError, type DownloadsNs, type SampleFn } from "@/lib/claude-runtime";
import { briefToPrompt, DEMO_SYSTEM_PROMPT, extractHtml } from "@/lib/demo-prompt";

import { GradientText } from "./primitives";

const field =
  "mt-2 w-full rounded-xl bg-white px-4 py-3 text-base text-[var(--nexa-navy)] ring-1 ring-[var(--border)] placeholder:text-[var(--nexa-lavender)] focus:outline-none focus:ring-2 focus:ring-[var(--nexa-blue)]";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "done"; email: string }
  | { kind: "error"; message: string }
  // Preview mode (opened as a Claude artifact): the demo is built right here.
  | { kind: "building"; chars: number }
  | { kind: "preview"; html: string; company: string };

const SAMPLE_ERRORS: Record<string, string> = {
  not_granted: "Demon tekeminen vaatii luvan käyttää Claudea. Salli se, kun sivu kysyy.",
  sampling_disabled: "Claude ei ole käytettävissä tällä tilillä.",
  rate_limited: "Käyttöraja tuli vastaan. Yritä hetken päästä uudelleen.",
  refused: "Tästä kuvauksesta ei voitu tehdä demoa. Muotoile toiveet toisin.",
  session_expired: "Kirjaudu uudelleen sisään Claudeen ja yritä uudelleen.",
};

/** Keeps the demo inert even if the model ignored the no-script rule. */
function stripScripts(html: string): string {
  return html.replace(/<script\b[\s\S]*?<\/script>/gi, "").replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
}

const STEPS = [
  { icon: Sparkles, text: "Kerro yrityksestäsi ja toiveistasi" },
  { icon: Clock, text: "Rakennamme demon muutamassa minuutissa" },
  { icon: Mail, text: "Saat linkin sähköpostiisi" },
];

export function DemoForm({ prefill = "", prefillKey = 0 }: { prefill?: string; prefillKey?: number }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [description, setDescription] = useState("");
  const [sample, setSample] = useState<SampleFn | null>(null);
  const [downloads, setDownloads] = useState<DownloadsNs | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [note, setNote] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  // Bring the finished demo into view.
  useEffect(() => {
    if (status.kind === "preview") document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
  }, [status.kind]);

  // Light up preview mode only when the Claude artifact runtime is present.
  useEffect(() => {
    let alive = true;
    void getSample().then((fn) => alive && setSample(() => fn));
    void getDownloads().then((ns) => alive && setDownloads(ns));
    return () => {
      alive = false;
    };
  }, []);

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
    if (sample) {
      await buildPreview(sample, String(payload.company ?? ""), String(payload.industry ?? ""));
      return;
    }

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

  async function buildPreview(fn: SampleFn, company: string, industry: string) {
    const ctl = new AbortController();
    abortRef.current = ctl;
    setNote("");
    setStatus({ kind: "building", chars: 0 });
    const prompt = `${DEMO_SYSTEM_PROMPT}\n\n${briefToPrompt({ company, industry, description })}`;
    try {
      const { text, truncated } = await fn(prompt, {
        signal: ctl.signal,
        modelTier: "default",
        cache: false,
        onText: ({ text: t }) => setStatus({ kind: "building", chars: t.length }),
      });
      const html = extractHtml(text);
      if (!html) {
        setStatus({ kind: "error", message: truncated ? "Demosta tuli liian pitkä. Lyhennä toiveita ja yritä uudelleen." : "Demon teko epäonnistui. Yritä uudelleen." });
        return;
      }
      setStatus({ kind: "preview", html: stripScripts(html), company });
    } catch (e) {
      const code = isSampleError(e) ? e.code : "upstream_error";
      if (code === "cancelled") {
        setStatus({ kind: "idle" });
        return;
      }
      setStatus({ kind: "error", message: SAMPLE_ERRORS[code] ?? "Yhteys Claudeen katkesi. Yritä uudelleen." });
    } finally {
      abortRef.current = null;
    }
  }

  async function saveDemo(html: string, company: string) {
    if (!downloads) return;
    const slug = company.toLowerCase().replace(/[^a-z0-9åäö]+/g, "-").replace(/^-|-$/g, "") || "demo";
    try {
      await downloads.save({ filename: `demo-${slug}.html`, data: html });
      setNote("Demo tallennettu.");
    } catch {
      setNote("Tallennus peruttiin.");
    }
  }

  if (status.kind === "preview") {
    return (
      <section id="demo" className="scroll-mt-24 bg-[var(--nexa-chip)]" style={{ padding: "clamp(48px, 6vw, 96px) clamp(16px, 4vw, 40px)" }}>
        <div className="mx-auto flex max-w-[1200px] flex-col gap-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-medium text-[var(--nexa-navy)]" style={{ fontSize: "clamp(26px, 3vw, 40px)", lineHeight: 1.15 }}>
                <GradientText>Demo valmis:</GradientText> {status.company}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-[var(--nexa-lavender-3)]">
                Esikatselussa demo näytetään tässä. Julkaistulla sivulla se lähetetään asiakkaalle sähköpostilla.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFullscreen(true)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-[var(--nexa-navy)] ring-1 ring-[var(--border)] hover:bg-[var(--nexa-chip)]"
              >
                <Maximize2 className="h-4 w-4" aria-hidden /> Koko näyttö
              </button>
              {downloads ? (
                <button
                  type="button"
                  onClick={() => saveDemo(status.html, status.company)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-[var(--nexa-navy)] ring-1 ring-[var(--border)] hover:bg-[var(--nexa-chip)]"
                >
                  <Download className="h-4 w-4" aria-hidden /> Lataa demo
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setStatus({ kind: "idle" })}
                className="nexa-grad-a-bg inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white"
              >
                Tee uusi demo
              </button>
            </div>
          </div>
          {note ? <p role="status" className="text-sm text-[var(--nexa-lavender-3)]">{note}</p> : null}
          <div
            className={
              fullscreen
                ? "fixed inset-0 z-[60] flex flex-col bg-white"
                : "nexa-soft-shadow overflow-hidden rounded-[24px] bg-white"
            }
            style={fullscreen ? { paddingTop: "env(safe-area-inset-top, 0px)" } : undefined}
          >
            {fullscreen ? (
              <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-2">
                <span className="truncate text-sm font-medium text-[var(--nexa-navy)]">Demo · {status.company}</span>
                <button
                  type="button"
                  onClick={() => setFullscreen(false)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--nexa-navy)] hover:bg-[var(--nexa-chip)]"
                >
                  <Minimize2 className="h-4 w-4" aria-hidden /> Sulje
                </button>
              </div>
            ) : null}
            <iframe
              title={`Demosivusto: ${status.company}`}
              srcDoc={status.html}
              sandbox=""
              className="w-full flex-1 border-0"
              style={fullscreen ? undefined : { height: "min(80vh, 760px)" }}
            />
          </div>
        </div>
      </section>
    );
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
              {status.kind === "building" ? (
                <div role="status" className="flex items-center justify-between gap-3 rounded-xl bg-[var(--nexa-chip)] px-4 py-3 text-sm">
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-[var(--nexa-blue)]" aria-hidden />
                    {status.chars === 0
                      ? "Suunnitellaan demoa... (voi kestää 1–3 min)"
                      : `Rakennetaan sivua... ${Math.round(status.chars / 1000)} kt valmiina`}
                  </span>
                  <button
                    type="button"
                    onClick={() => abortRef.current?.abort()}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-[var(--nexa-navy)] hover:bg-white"
                  >
                    <Square className="h-3.5 w-3.5" aria-hidden /> Pysäytä
                  </button>
                </div>
              ) : null}
              {status.kind === "error" ? (
                <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {status.message}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={status.kind === "sending" || status.kind === "building"}
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
