import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { SectionHead } from "./section-head";
import { BrowserFrame, KaneliSite, LumoSite, VirtaSite } from "./site-mockups";

interface Concept {
  name: string;
  industry: string;
  url: string;
  features: string[];
  prompt: string;
  site: ReactNode;
}

const CONCEPTS: Concept[] = [
  {
    name: "Bistro Kaneli",
    industry: "Ravintola",
    url: "sivuseppa.fi/demo/bistro-kaneli",
    features: ["Ruokalista", "Lounaslista", "Pöytävaraus"],
    prompt: "Ravintolalle tunnelmalliset sivut: ruokalista, lounaslista, aukioloajat ja pöytävaraus. Lämmin ja tumma tunnelma.",
    site: <KaneliSite />,
  },
  {
    name: "Virta Rakennus",
    industry: "Rakennusliike",
    url: "sivuseppa.fi/demo/virta-rakennus",
    features: ["Palvelut", "Referenssit", "Tarjouspyyntö"],
    prompt: "Rakennusliikkeelle selkeät sivut: palvelut, referenssikohteet ja tarjouspyyntölomake. Luotettava ja vahva ilme.",
    site: <VirtaSite />,
  },
  {
    name: "Studio Lumo",
    industry: "Kauneushoitola",
    url: "sivuseppa.fi/demo/studio-lumo",
    features: ["Ajanvaraus", "Hinnasto", "Lahjakortit"],
    prompt: "Kauneushoitolalle rauhalliset sivut: hoitojen hinnasto, ajanvaraus ja lahjakortit. Pehmeä ja vaalea ilme.",
    site: <LumoSite />,
  },
];

function ConceptCard({ concept, onPick, large = false }: { concept: Concept; onPick: (prompt: string) => void; large?: boolean }) {
  return (
    <article
      className={cn(
        "nexa-lift flex flex-col rounded-[28px] bg-[var(--nexa-surface)] p-2.5 ring-1 ring-[var(--border)] sm:p-3",
        large && "lg:col-span-2 lg:grid lg:grid-cols-[1.6fr_1fr] lg:items-center lg:gap-4",
      )}
    >
      <BrowserFrame url={concept.url} label={`Esimerkkikonsepti: ${concept.industry.toLowerCase()} ${concept.name}`}>
        {concept.site}
      </BrowserFrame>
      <div className={cn("flex flex-col gap-4 px-3 pb-3 pt-5 sm:px-4", large && "lg:px-6 lg:py-6")}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--nexa-muted)]">Esimerkkikonsepti · {concept.industry}</p>
          <h3 className={cn("mt-1.5 font-semibold tracking-[-0.02em] text-[var(--nexa-navy)]", large ? "text-2xl lg:text-3xl" : "text-xl")}>{concept.name}</h3>
        </div>
        <ul className="flex flex-wrap gap-2">
          {concept.features.map((f) => (
            <li key={f} className="rounded-full bg-white px-3 py-1 text-sm text-[var(--nexa-navy)] ring-1 ring-[var(--border)]">
              {f}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => onPick(concept.prompt)}
          className="group mt-1 inline-flex min-h-11 w-fit cursor-pointer items-center gap-2 rounded-xl bg-[var(--nexa-navy)] px-4 text-sm font-medium text-white transition-colors hover:bg-[#2b1a7a]"
        >
          Tee tästä minulle demo
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </button>
      </div>
    </article>
  );
}

export function Showcase({ onPick }: { onPick: (prompt: string) => void }) {
  const [first, ...rest] = CONCEPTS;
  return (
    <section id="tyot" className="bg-white px-4 py-24 sm:px-6 lg:py-32">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <SectionHead chip="Työnäytteet" title="Jokaiselle toimialalle oma ilme." align="left" />
          <p className="max-w-xl text-[var(--nexa-muted)] lg:justify-self-end lg:pb-2" style={{ fontSize: "clamp(16px, 1.2vw, 18px)", lineHeight: 1.6 }}>
            Kolme esimerkkikonseptia eri toimialoille. Valitse sinua lähin, niin teemme siitä ilmaisen demon
            yrityksesi nimellä.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          <ConceptCard concept={first} onPick={onPick} large />
          {rest.map((c) => (
            <ConceptCard key={c.name} concept={c} onPick={onPick} />
          ))}
        </div>
      </div>
    </section>
  );
}
