import * as React from "react";
import { Accessibility, ArrowRight, Check, Gauge, KeyRound, Palette, Plus, Search, Smartphone } from "lucide-react";

import { QuoteForm } from "@/components/site/quote-form";
import { Section, SectionHeading } from "@/components/site/section";
import { buttonVariants } from "@/components/ui/button";
import type { DishTier } from "@/components/ui/sushi-conveyor-menu";
import { site, templates, TIER_PRICES } from "@/content/site";
import { cn } from "@/lib/utils";

const ICONS = {
  palette: Palette,
  smartphone: Smartphone,
  gauge: Gauge,
  search: Search,
  accessibility: Accessibility,
  key: KeyRound,
} as const;

/** Same order and colours as the plate rings on the belt. */
const TIER_DOTS: Record<DishTier, string> = {
  1: "border-chart-1",
  2: "border-chart-2",
  3: "border-chart-3",
  4: "border-chart-4",
  5: "border-chart-5",
};

const reveal = (index: number) => ({ "data-reveal": "", style: { "--reveal-index": index } as React.CSSProperties });

export function Service() {
  const { service } = site;
  return (
    <Section id="palvelu">
      <SectionHeading id="palvelu" eyebrow={service.eyebrow} heading={service.heading} lead={service.lead} />
      <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {service.items.map((item, index) => {
          const Icon = ICONS[item.icon];
          return (
            <li key={item.title} className="bg-background">
              <div {...reveal(index % 3)} className="flex h-full flex-col gap-4 p-6 md:p-8">
                <Icon aria-hidden="true" strokeWidth={1.5} className="size-7 text-highlight" />
                <h3 className="text-lg font-medium tracking-tight">{item.title}</h3>
                <p className="text-pretty leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

export function Process() {
  const { process } = site;
  return (
    <Section id="prosessi" className="border-y border-border bg-card">
      <SectionHeading id="prosessi" eyebrow={process.eyebrow} heading={process.heading} lead={process.lead} />
      <ol className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {process.steps.map((step, index) => (
          <li key={step.title} {...reveal(index)} className="relative flex flex-col gap-4 border-t border-border pt-6">
            <span aria-hidden="true" className="absolute -top-px left-0 h-px w-12 bg-highlight" />
            <span className="font-serif text-5xl italic leading-none text-highlight">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="text-xl font-medium tracking-tight">{step.title}</h3>
            <p className="text-pretty leading-relaxed text-muted-foreground">{step.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function Pricing() {
  const { pricing } = site;
  const tiers = ([1, 2, 3, 4, 5] as DishTier[]).map((tier) => ({
    tier,
    price: TIER_PRICES[tier],
    items: templates.filter((item) => item.tier === tier),
  }));

  return (
    <Section id="hinnasto">
      <SectionHeading id="hinnasto" eyebrow={pricing.eyebrow} heading={pricing.heading} lead={pricing.lead} />

      <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h3 className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">{pricing.tierHeading}</h3>
          <ul className="mt-5 border-b border-border">
            {tiers.map(({ tier, price, items }, index) => (
              <li
                key={tier}
                {...reveal(index)}
                className="grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-3 border-t border-border py-6 sm:grid-cols-[auto_11rem_1fr]"
              >
                <span aria-hidden="true" className={cn("size-3 translate-y-px rounded-full border-2", TIER_DOTS[tier])} />
                <p className="text-2xl font-medium tabular-nums tracking-tight md:text-3xl">{price}</p>
                <ul className="col-span-2 flex flex-col gap-2 sm:col-span-1">
                  {items.map((item) => (
                    <li key={item.id} className="flex flex-wrap items-baseline gap-x-2 leading-snug">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-muted-foreground">{item.audience}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">{pricing.note}</p>
        </div>

        <div className="flex flex-col gap-10 lg:col-span-5">
          <div data-reveal className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <h3 className="text-lg font-medium tracking-tight">{pricing.includedHeading}</h3>
            <ul className="mt-5 flex flex-col gap-3.5">
              {pricing.included.map((line) => (
                <li key={line} className="flex items-start gap-3 leading-snug">
                  <Check aria-hidden="true" strokeWidth={2} className="mt-0.5 size-[1.125rem] shrink-0 text-highlight" />
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">{pricing.extrasHeading}</h3>
            <dl className="mt-4">
              {pricing.extras.map((extra) => (
                <div key={extra.name} className="flex items-baseline justify-between gap-4 border-t border-border py-3.5 last:border-b">
                  <dt>{extra.name}</dt>
                  <dd className="shrink-0 tabular-nums text-muted-foreground">{extra.price}</dd>
                </div>
              ))}
            </dl>
            <a href="#tarjous" className={cn(buttonVariants(), "group mt-8")}>
              {pricing.cta}
              <ArrowRight aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function Faq() {
  const { faq } = site;
  return (
    <Section id="kysymykset" className="border-t border-border">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <SectionHeading id="kysymykset" eyebrow={faq.eyebrow} heading={faq.heading} className="lg:col-span-5" />
        <div className="lg:col-span-7">
          {faq.items.map((item) => (
            <details key={item.q} name="ukk" className="faq group border-t border-border last:border-b">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-sm py-5 text-left text-lg font-medium tracking-tight outline-none transition-colors duration-200 hover:text-highlight focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                {item.q}
                <Plus
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="size-6 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none"
                />
              </summary>
              <p className="max-w-2xl text-pretty pb-6 pr-10 leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function Quote() {
  const { quote, contact } = site;
  return (
    <Section id="tarjous" className="border-t border-border bg-card/40">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading id="tarjous" eyebrow={quote.eyebrow} heading={quote.heading} lead={quote.lead} />
          <ul className="mt-8 flex flex-col gap-3">
            {quote.points.map((point) => (
              <li key={point} className="flex items-center gap-3">
                <Check aria-hidden="true" strokeWidth={2} className="size-[1.125rem] shrink-0 text-highlight" />
                {point}
              </li>
            ))}
          </ul>
          <p className="mt-10 text-sm text-muted-foreground">
            {quote.direct}{" "}
            <a
              href={`mailto:${contact.email}`}
              className="rounded-sm font-medium text-foreground underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {contact.email}
            </a>
          </p>
        </div>
        <div className="lg:col-span-7">
          <QuoteForm />
        </div>
      </div>
    </Section>
  );
}
