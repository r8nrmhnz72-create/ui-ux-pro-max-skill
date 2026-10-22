import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";

import { SectionHead } from "./section-head";

const STEPS = [
  { label: "Kartoitus", time: "30 min puhelu", items: ["tavoitteet", "kohderyhmä", "budjetti", "aikataulu"] },
  { label: "Suunnittelu", time: "3–5 päivää", items: ["rakenne", "ulkoasu", "tekstit", "kuvat"] },
  { label: "Toteutus", time: "1–2 viikkoa", items: ["koodi", "hakukoneet", "testaus", "hyväksyntä"] },
  { label: "Julkaisu", time: "1 päivä", items: ["domain", "koulutus", "takuu", "ylläpito"] },
];

export function Precision() {
  return (
    <section
      id="thinking"
      aria-label="Prosessi"
      className="relative overflow-hidden px-4 py-24 sm:px-6 lg:py-32"
      style={{
        background:
          "radial-gradient(50% 40% at 85% 10%, rgba(200,111,255,.16), transparent 70%), radial-gradient(50% 40% at 5% 95%, rgba(43,167,255,.12), transparent 70%), linear-gradient(#ffffff, #f6f3ff)",
      }}
    >
      <div aria-hidden className="nexa-grid-light pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-[1200px]">
        <SectionHead chip="Näin se etenee" title="Ideasta valmiiseen sivustoon" highlight="neljässä vaiheessa.">
          Maksuttomasta kartoituksesta julkaisuun. Tiedät koko ajan, missä mennään ja mitä seuraavaksi tapahtuu.
        </SectionHead>

        <ol className="mt-16 grid gap-5 [--stair:0px] sm:grid-cols-2 lg:grid-cols-4 lg:items-end lg:[--stair:2.75rem]">
          {STEPS.map((step, i) => (
            <li
              key={step.label}
              className="nexa-soft-shadow relative rounded-[24px] bg-white/85 p-5 ring-1 ring-[var(--border)] backdrop-blur sm:p-6"
              style={{ marginBottom: `calc(var(--stair) * ${i})` } as CSSProperties}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="nexa-grad-a-bg grid size-10 place-items-center rounded-xl text-sm font-bold text-white tabular-nums">
                  0{i + 1}
                </span>
                <span className="rounded-full bg-[var(--nexa-surface)] px-3 py-1 text-xs font-medium text-[var(--nexa-muted)]">{step.time}</span>
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-[-0.01em] text-[var(--nexa-navy)]">{step.label}</h3>
              <div className="mt-4 flex gap-4">
                <span aria-hidden className="nexa-grad-line-bg hidden w-px shrink-0 lg:block" />
                <ul className="flex flex-wrap gap-2 text-[15px] text-[var(--nexa-muted)] lg:block lg:space-y-1.5">
                  {step.items.map((item) => (
                    <li key={item} className="rounded-full bg-[var(--nexa-surface)] px-3 py-1 lg:rounded-none lg:bg-transparent lg:p-0">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-14 flex justify-center">
          <a
            href="#kuvaile"
            className="group inline-flex min-h-12 items-center gap-2 rounded-xl bg-[var(--nexa-navy)] px-6 text-base font-medium text-white transition-colors hover:bg-[#2b1a7a]"
          >
            Aloita ilmaisella demolla
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
