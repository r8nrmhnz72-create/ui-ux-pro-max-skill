import { ArrowDown, ArrowRight } from "lucide-react";

import { HeroBackdrop } from "@/components/site/hero-backdrop";
import { Eyebrow } from "@/components/site/section";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

export function Hero() {
  const { hero } = site;
  return (
    <section
      aria-labelledby="hero-otsikko"
      className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden bg-background"
    >
      <HeroBackdrop />
      {/* Keeps the copy readable over the particles and lets the wave melt into the page below. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, var(--background) 0%, color-mix(in oklab, var(--background) 55%, transparent) 16%, transparent 36%), radial-gradient(78% 88% at 8% 70%, color-mix(in oklab, var(--background) 88%, transparent) 0%, color-mix(in oklab, var(--background) 62%, transparent) 46%, transparent 76%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-14 pt-32 md:px-8 lg:px-10 md:pb-20">
        <Eyebrow className="flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-8 bg-highlight" />
          {hero.eyebrow}
        </Eyebrow>

        <h1
          id="hero-otsikko"
          className="mt-6 max-w-5xl text-balance text-[clamp(2.125rem,7.4vw,5.5rem)] font-semibold leading-[1.02] tracking-[-0.035em]"
        >
          {hero.title.lead}{" "}
          <em className="block font-serif font-normal italic tracking-[-0.01em] text-highlight">{hero.title.emphasis}</em>
        </h1>

        <p className="mt-7 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">{hero.lead}</p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a href={hero.primaryCta.href} className={cn(buttonVariants({ variant: "accent", size: "lg" }), "group")}>
            {hero.primaryCta.label}
            <ArrowDown aria-hidden="true" className="transition-transform duration-200 group-hover:translate-y-0.5 motion-reduce:transition-none" />
          </a>
          <a href={hero.secondaryCta.href} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "group")}>
            {hero.secondaryCta.label}
            <ArrowRight aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </a>
        </div>

        <dl className="mt-14 grid max-w-2xl grid-cols-3 gap-x-6 border-t border-border pt-6 md:mt-20">
          {hero.facts.map((fact) => (
            <div key={fact.label} className="flex flex-col-reverse justify-end gap-1.5">
              <dt className="text-xs leading-snug text-muted-foreground md:text-sm">{fact.label}</dt>
              <dd className="text-xl font-medium tabular-nums tracking-tight md:text-3xl">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
