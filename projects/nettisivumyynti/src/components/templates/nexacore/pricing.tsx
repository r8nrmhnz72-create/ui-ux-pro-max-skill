import { Check } from "lucide-react";

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

export function Pricing() {
  return (
    <section
      id="hinnat"
      className="scroll-mt-24 bg-white"
      style={{ padding: "clamp(64px, 8vw, 120px) clamp(16px, 4vw, 40px)" }}
    >
      <SectionHead chip="Hinnat" title="Selkeä hinta," highlight="ei yllätyksiä.">
        Kiinteä kertahinta. Ylläpito alkaen 39 €/kk, ja voit lopettaa milloin tahansa.
      </SectionHead>

      <div className="mx-auto mt-14 grid max-w-[1200px] items-start gap-5 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <article
            key={plan.name}
            className={cn(
              "relative rounded-[28px] p-8",
              plan.featured
                ? "bg-[var(--nexa-card-dark)] text-white"
                : "nexa-soft-shadow bg-white text-[var(--nexa-navy)]",
            )}
          >
            {plan.featured ? (
              <>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[28px]"
                  style={{
                    background:
                      "radial-gradient(120% 70% at 50% 0%, rgba(200,111,255,.4), transparent 70%)",
                  }}
                />
                <span className="nexa-grad-a-bg absolute -top-3 left-8 rounded-full px-3 py-1 text-xs font-semibold text-white">
                  Suosituin
                </span>
              </>
            ) : null}
            <div className="relative">
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className={cn("mt-2 text-sm", plan.featured ? "text-[var(--nexa-lavender-2)]" : "text-[var(--nexa-lavender-3)]")}>
                {plan.desc}
              </p>
              <p className="mt-6 flex items-baseline gap-1.5">
                <span className="text-5xl font-semibold tracking-tight tabular-nums">{plan.price} €</span>
                <span className={cn("text-sm", plan.featured ? "text-[var(--nexa-lavender-2)]" : "text-[var(--nexa-lavender-3)]")}>
                  + alv
                </span>
              </p>
              <a
                href="#yhteys"
                className={cn(
                  "mt-8 flex w-full items-center justify-center rounded-xl px-5 py-3 text-base font-medium transition-opacity",
                  plan.featured
                    ? "nexa-grad-a-bg text-white hover:opacity-90"
                    : "bg-[var(--nexa-blue)] text-white hover:opacity-90",
                )}
              >
                Valitse {plan.name}
              </a>
              <ul className="mt-8 space-y-3 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <Check
                      className={cn("h-5 w-5 shrink-0", plan.featured ? "text-[var(--nexa-accent)]" : "text-[var(--nexa-blue)]")}
                      strokeWidth={2.5}
                      aria-hidden
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
