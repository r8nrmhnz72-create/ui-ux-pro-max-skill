import { Check, X } from "lucide-react";

import { HlsVideo } from "./hls-video";
import { BrandMark } from "./primitives";
import { SectionHead } from "./section-head";

const FREEDOM_HLS =
  "https://stream.mux.com/bnYL6x5cAX6WiJv2pOKpITehZd3NVdXpj3ylJFpX5Lk.m3u8";

const NEGATIVES = [
  "Vanha sivu latautuu hitaasti ja hajoaa puhelimella",
  "Iltojen säätäminen kotisivukoneen kanssa",
  "Kukaan ei löydä sivua Googlesta",
  "Yllättävät lisälaskut ja epäselvät aikataulut",
  "Kävijät tulevat, mutta eivät ota yhteyttä",
];

const POSITIVES = [
  "Salamannopea sivusto, joka toimii kaikilla laitteilla",
  "Me hoidamme tekniikan, sinä hyväksyt luonnokset",
  "Hakukoneoptimointi ja Google-profiili valmiina",
  "Kiinteä hinta ja sovittu valmistumispäivä",
  "Selkeät yhteydenottopolut, jotka tuovat tarjouspyyntöjä",
];

function Orb() {
  return (
    <div className="relative size-[180px] shrink-0 sm:size-[220px] lg:size-[260px]">
      <div
        aria-hidden
        className="nexa-orb-spin absolute -inset-3 rounded-full opacity-60 blur-2xl"
        style={{ background: "conic-gradient(from 0deg, #1c4eff, #ac24ff, #fe881b, #2ba7ff, #1c4eff)" }}
      />
      <div
        className="absolute inset-0 overflow-hidden rounded-full ring-1 ring-white/60"
        style={{ background: "radial-gradient(circle at 30% 28%, #2ba7ff, #ac24ff 55%, #fe881b 100%)" }}
      >
        {/* The mark shows when the video is unavailable; the video paints over it. */}
        <div aria-hidden className="absolute inset-0 grid place-items-center">
          <span className="grid size-16 place-items-center rounded-full bg-white shadow-lg sm:size-20">
            <BrandMark style={{ width: 34, height: 34 }} />
          </span>
        </div>
        <HlsVideo src={FREEDOM_HLS} />
      </div>
    </div>
  );
}

export function Freedom() {
  return (
    <section id="method" className="bg-white px-4 py-24 sm:px-6 lg:py-32">
      <div className="mx-auto max-w-[1200px]">
        <SectionHead chip="Miksi Sivuseppä" title="Lopeta sivuston kanssa säätäminen." highlight="Anna sen myydä puolestasi." breakBeforeHighlight />

        <div className="mt-14 grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
          <div className="order-2 rounded-[28px] bg-[var(--nexa-surface)] p-4 sm:p-6 lg:order-none">
            <p className="mb-4 flex items-center gap-2 px-1 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--nexa-muted)]">
              <X className="size-4" aria-hidden strokeWidth={2.5} />
              Ilman ammattilaista
            </p>
            <ul className="space-y-2.5">
              {NEGATIVES.map((text) => (
                <li key={text} className="flex items-start gap-3 rounded-2xl bg-white/70 px-4 py-3.5 text-[15px] text-[var(--nexa-muted)] ring-1 ring-[var(--border)]">
                  <X className="mt-0.5 size-4 shrink-0" aria-hidden strokeWidth={2.5} />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="order-first flex justify-center lg:order-none">
            <Orb />
          </div>

          <div className="nexa-grad-border-light nexa-soft-shadow order-3 rounded-[28px] p-4 sm:p-6 lg:order-none">
            <p className="mb-4 flex items-center gap-2 px-1 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--nexa-blue)]">
              <Check className="size-4" aria-hidden strokeWidth={2.5} />
              Sivusepän kanssa
            </p>
            <ul className="space-y-2.5">
              {POSITIVES.map((text) => (
                <li key={text} className="flex items-start gap-3 rounded-2xl bg-[var(--nexa-surface)] px-4 py-3.5 text-[15px] font-medium text-[var(--nexa-navy)]">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[var(--nexa-blue)] text-white">
                    <Check className="size-3" aria-hidden strokeWidth={3} />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
