import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";

const plans = [
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
    features: ["Kaikki Yritys-paketista", "Tuotehallinta", "Paytrail / Stripe -maksut", "Toimitustavat ja Posti-integraatio", "Koulutus kaupan käyttöön"],
  },
];

export function Pricing() {
  return (
    <section id="hinnat" className="scroll-mt-8 px-6 py-24 sm:py-32">
      <SectionHeading
        eyebrow="Hinnat"
        title="Selkeä hinta, ei yllätyksiä"
        description="Kiinteä kertahinta. Ylläpito alkaen 39 €/kk – voit lopettaa milloin tahansa."
      />
      <div className="mx-auto mt-14 grid max-w-6xl items-start gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={cn(
              "relative rounded-3xl p-8 ring-1",
              plan.featured ? "bg-white text-neutral-900 ring-white" : "bg-[var(--bg-100)] ring-white/10",
            )}
          >
            {plan.featured && (
              <span className="absolute -top-3 left-8 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-neutral-950">
                Suosituin
              </span>
            )}
            <h3 className={cn("text-lg font-semibold", plan.featured ? "text-neutral-900" : "text-white")}>{plan.name}</h3>
            <p className={cn("mt-2 text-sm", plan.featured ? "text-neutral-600" : "text-[var(--text-300)]")}>{plan.desc}</p>
            <p className="mt-6 flex items-baseline gap-1">
              <span className="font-instrument-serif text-5xl tracking-tight">{plan.price} €</span>
              <span className={cn("text-sm", plan.featured ? "text-neutral-600" : "text-[var(--text-300)]")}>+ alv</span>
            </p>
            <a
              href="#yhteys"
              className={cn(
                "mt-8 flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-colors",
                plan.featured ? "bg-neutral-900 text-white hover:bg-neutral-800" : "bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15",
              )}
            >
              Valitse {plan.name}
            </a>
            <ul className="mt-8 space-y-3 text-sm">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-3">
                  <Check className={cn("h-5 w-5 shrink-0", plan.featured ? "text-emerald-600" : "text-emerald-400")} aria-hidden />
                  <span className={plan.featured ? "text-neutral-700" : "text-[var(--text-200)]"}>{f}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
