import { ArrowRight, Check, Globe, GraduationCap, LifeBuoy, Lock, ShieldCheck, Smartphone, Wrench } from "lucide-react";

import { cn } from "@/lib/utils";

import { SectionHead } from "./section-head";

const PLANS = [
  {
    name: "Startti",
    price: "990",
    desc: "Yhden sivun kotisivu pienyrittäjälle tai uudelle yritykselle.",
    features: ["1-sivuinen sivusto", "Mobiilioptimointi", "Yhteydenottolomake", "Perus-SEO", "Valmis 1 viikossa"],
  },
  {
    name: "Yritys",
    price: "2 490",
    desc: "Täysi yrityssivusto, joka myy palveluitasi puolestasi.",
    features: ["Jopa 8 alasivua", "Räätälöity ulkoasu", "Helppo sisällönhallinta", "SEO + Google-yritysprofiili", "Analytiikka ja evästeet", "Valmis 2–3 viikossa"],
    featured: true,
  },
  {
    name: "Verkkokauppa",
    price: "4 900",
    desc: "Myy tuotteita verkossa suomalaisilla maksutavoilla.",
    features: ["Kaikki Yritys-paketista", "Tuotehallinta", "Paytrail / Stripe -maksut", "Posti-integraatio", "Koulutus kaupan käyttöön"],
  },
];

const INCLUDED = [
  { icon: Globe, text: "Domain ja hosting 1. vuoden" },
  { icon: Lock, text: "SSL-suojattu yhteys" },
  { icon: Smartphone, text: "Toimii kaikilla laitteilla" },
  { icon: ShieldCheck, text: "GDPR-evästeilmoitus" },
  { icon: GraduationCap, text: "Koulutus päivittämiseen" },
  { icon: LifeBuoy, text: "30 päivän takuu" },
];

function PlanCard({ plan }: { plan: (typeof PLANS)[number] }) {
  const featured = Boolean(plan.featured);
  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-[28px] p-7 sm:p-8",
        featured ? "nexa-grad-border text-white shadow-[0_30px_60px_-24px_rgba(28,78,255,.45)]" : "nexa-soft-shadow bg-white text-[var(--nexa-navy)] ring-1 ring-[var(--border)]",
      )}
    >
      {featured ? (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[28px]"
            style={{ background: "radial-gradient(120% 60% at 50% 0%, rgba(200,111,255,.35), transparent 70%)" }}
          />
          <span className="nexa-grad-a-bg absolute -top-3.5 left-7 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-lg">Suosituin</span>
        </>
      ) : null}
      <div className="relative flex h-full flex-col">
        <h3 className="text-lg font-semibold">{plan.name}</h3>
        <p className={cn("mt-2 min-h-[3rem] text-[15px] leading-relaxed", featured ? "text-[var(--nexa-lavender-2)]" : "text-[var(--nexa-muted)]")}>{plan.desc}</p>
        <p className="mt-6 flex items-baseline gap-1.5">
          <span className="text-5xl font-semibold tracking-[-0.03em] tabular-nums sm:text-6xl">{plan.price}</span>
          <span className="text-2xl font-semibold">€</span>
          <span className={cn("ml-1 text-sm", featured ? "text-[var(--nexa-lavender-2)]" : "text-[var(--nexa-muted)]")}>+ alv</span>
        </p>
        <p className={cn("mt-1 text-sm", featured ? "text-[var(--nexa-lavender-2)]" : "text-[var(--nexa-muted)]")}>Kertamaksu, ei kuukausisitoumusta</p>
        <a
          href="#yhteys"
          className={cn(
            "group mt-7 flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-base font-medium transition-opacity hover:opacity-90",
            featured ? "nexa-grad-a-bg text-white" : "bg-[var(--nexa-navy)] text-white",
          )}
        >
          Valitse {plan.name}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </a>
        <ul className={cn("mt-8 space-y-3 border-t pt-7 text-[15px]", featured ? "border-white/10" : "border-[var(--border)]")}>
          {plan.features.map((f) => (
            <li key={f} className="flex gap-3">
              <span
                className={cn(
                  "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full",
                  featured ? "bg-white/10 text-[var(--nexa-accent)]" : "bg-[var(--nexa-surface)] text-[var(--nexa-blue)]",
                )}
              >
                <Check className="size-3.5" strokeWidth={3} aria-hidden />
              </span>
              <span className={featured ? "text-white/90" : "text-[var(--nexa-navy)]"}>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function Pricing() {
  return (
    <section id="hinnat" className="bg-white px-4 py-24 sm:px-6 lg:py-32">
      <div className="mx-auto max-w-[1200px]">
        <SectionHead chip="Hinnat" title="Selkeä hinta," highlight="ei yllätyksiä.">
          Kiinteä kertahinta, joka sovitaan ennen töiden aloitusta. Tiedät tarkalleen, mitä saat ja mitä se maksaa.
        </SectionHead>

        <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-3 lg:gap-5">
          {PLANS.map((plan) => (
            <div key={plan.name} className={cn(plan.featured && "lg:-my-4")}>
              <PlanCard plan={plan} />
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-[28px] bg-[var(--nexa-surface)] p-6 ring-1 ring-[var(--border)] sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--nexa-muted)]">Kaikki paketit sisältävät</p>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INCLUDED.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-[15px] text-[var(--nexa-navy)]">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-[var(--nexa-blue)] ring-1 ring-[var(--border)]">
                  <Icon className="size-5" aria-hidden />
                </span>
                {text}
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-col gap-4 border-t border-[var(--border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-3 text-[15px] text-[var(--nexa-navy)]">
              <Wrench className="mt-0.5 size-5 shrink-0 text-[var(--nexa-accent)]" aria-hidden />
              <span>
                <strong className="font-semibold">Ylläpito alkaen 39 €/kk.</strong>{" "}
                <span className="text-[var(--nexa-muted)]">Päivitykset, varmuuskopiot ja muutospyynnöt. Voit lopettaa milloin tahansa.</span>
              </span>
            </p>
            <a href="#yhteys" className="group inline-flex min-h-11 shrink-0 items-center gap-2 font-medium text-[var(--nexa-blue)]">
              Kysy lisää
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
