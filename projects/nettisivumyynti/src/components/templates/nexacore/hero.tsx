import { useId } from "react";
import {
  ArrowRight,
  BellRing,
  Calculator,
  Camera,
  Check,
  Dumbbell,
  HardHat,
  Play,
  HeartPulse,
  House,
  Scissors,
  ShoppingBag,
  Sparkles,
  Utensils,
} from "lucide-react";

import { BrowserFrame, LumoPhone, LumoSite, PhoneFrame } from "./site-mockups";

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_115655_b4d9cd77-feed-43cd-a198-af78ebdf1f7a.mp4";

const INDUSTRIES = [
  { icon: Utensils, label: "Ravintolat" },
  { icon: Scissors, label: "Parturit" },
  { icon: HardHat, label: "Rakennusala" },
  { icon: Sparkles, label: "Kauneushoitolat" },
  { icon: Calculator, label: "Tilitoimistot" },
  { icon: ShoppingBag, label: "Verkkokaupat" },
  { icon: HeartPulse, label: "Hyvinvointi" },
  { icon: House, label: "Kiinteistövälitys" },
  { icon: Dumbbell, label: "Kuntosalit" },
  { icon: Camera, label: "Valokuvaajat" },
];

const PROMISES = ["Kiinteä hinta", "Valmis jopa 2 viikossa", "30 päivän takuu"];

/** Score ring used in the floating "Nopeus" card. */
export function ScoreRing({ value, size = 52, track = "#ebe7f5", color = "currentColor" }: { value: number; size?: number; track?: string; color?: string }) {
  const id = `ring-${useId().replace(/:/g, "")}`;
  const r = 24;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" aria-hidden className="shrink-0">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#34d399" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
      <circle cx="30" cy="30" r={r} stroke={track} strokeWidth="6" fill="none" />
      <circle
        cx="30"
        cy="30"
        r={r}
        stroke={`url(#${id})`}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - value / 100)}
        transform="rotate(-90 30 30)"
      />
      <text x="30" y="35.5" textAnchor="middle" fontSize="16" fontWeight="700" fill={color}>
        {value}
      </text>
    </svg>
  );
}

function HeroShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-[620px] pt-6 pb-10 lg:max-w-none lg:pt-0 lg:pb-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 rounded-[48px] opacity-70 blur-3xl"
        style={{ background: "radial-gradient(50% 50% at 60% 50%, rgba(172,36,255,.45), rgba(28,78,255,.25) 50%, transparent 75%)" }}
      />
      <BrowserFrame
        url="sivuseppa.fi/demo/studio-lumo"
        label="Esimerkkisivusto: kauneushoitola Studio Lumon kotisivu ajanvarauksella"
        className="relative"
      >
        <LumoSite />
      </BrowserFrame>

      <PhoneFrame
        label="Sama sivusto puhelimella"
        className="absolute -bottom-8 right-0 hidden w-[23%] sm:block lg:-right-8"
      >
        <LumoPhone />
      </PhoneFrame>

      <div
        aria-hidden
        className="nexa-float absolute -top-1 right-3 flex items-center gap-3 rounded-2xl bg-white py-2.5 pl-2.5 pr-4 text-[var(--nexa-navy)] shadow-[0_20px_40px_-16px_rgba(11,5,38,.55)] sm:right-[30%] lg:-top-4"
      >
        <ScoreRing value={98} size={44} color="var(--nexa-navy)" />
        <div className="leading-tight">
          <p className="text-xs text-[var(--nexa-muted)]">Nopeus mobiilissa</p>
          <p className="text-sm font-semibold">98 / 100</p>
        </div>
      </div>

      <div
        aria-hidden
        className="nexa-float-late absolute -bottom-1 left-3 flex items-center gap-3 rounded-2xl bg-white py-2.5 pl-2.5 pr-4 text-[var(--nexa-navy)] shadow-[0_20px_40px_-16px_rgba(11,5,38,.55)] lg:-left-8"
      >
        <span className="nexa-grad-a-bg grid size-10 place-items-center rounded-xl text-white">
          <BellRing className="size-5" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold">Uusi ajanvaraus</p>
          <p className="text-xs text-[var(--nexa-muted)]">Ti 13.11. klo 11.30 · Kasvohoito</p>
        </div>
      </div>
    </div>
  );
}

function Industries() {
  return (
    <div className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1200px] items-center gap-6 py-4 pl-4 sm:pl-6 lg:pr-6">
        <p className="hidden shrink-0 text-sm text-white/60 lg:block">Teemme sivuja mm.</p>
        <ul
          aria-label="Toimialoja, joille teemme sivuja"
          className="nexa-no-scrollbar nexa-fade-right flex flex-1 snap-x gap-2.5 overflow-x-auto pr-8"
        >
          {INDUSTRIES.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="inline-flex shrink-0 snap-start items-center gap-2 rounded-full bg-white/[0.06] px-3.5 py-2 text-sm text-white/80 ring-1 ring-white/10"
            >
              <Icon className="size-4 text-[var(--nexa-lavender-2)]" aria-hidden />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="home"
      data-slot="hero"
      className="relative overflow-hidden text-white"
      style={{
        // Shown until (or instead of) the video, e.g. when it can't load.
        background:
          "radial-gradient(55% 45% at 15% 15%, rgba(28,78,255,.5), transparent 70%), radial-gradient(45% 45% at 90% 35%, rgba(172,36,255,.45), transparent 70%), radial-gradient(60% 35% at 50% 100%, rgba(254,136,27,.22), transparent 70%), var(--nexa-ink)",
      }}
    >
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-50"
        src={HERO_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0b0526]/60 via-[#0b0526]/30 to-[#0b0526]/80" />
      <div aria-hidden className="nexa-grid-dark pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-10 px-4 pt-32 pb-12 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:pt-40 lg:pb-20">
        <div>
          <a
            href="#kuvaile"
            className="animate-fade-slide-in-1 inline-flex items-center gap-2.5 rounded-full bg-white/[0.07] py-1.5 pl-1.5 pr-3.5 text-sm text-white/90 ring-1 ring-white/15 transition-colors hover:bg-white/[0.12]"
          >
            <span className="nexa-grad-a-bg rounded-full px-2.5 py-0.5 text-xs font-semibold">Uutta</span>
            Ilmainen demosivusto minuuteissa
            <ArrowRight className="size-4" aria-hidden />
          </a>

          <h1
            className="animate-fade-slide-in-2 mt-7 font-semibold tracking-[-0.035em] text-balance"
            style={{ fontSize: "clamp(42px, 6vw, 78px)", lineHeight: 1.02 }}
          >
            Nettisivut, jotka <span className="nexa-serif nexa-grad-text">tuovat asiakkaita.</span>
          </h1>

          <p
            className="animate-fade-slide-in-3 mt-6 max-w-[34rem] text-[var(--nexa-lavender-2)]"
            style={{ fontSize: "clamp(16px, 1.3vw, 19px)", lineHeight: 1.6 }}
          >
            Suunnittelemme ja rakennamme yrityksellesi nopean, hakukoneystävällisen sivuston, joka toimii
            puhelimella. Kiinteä hinta, ei piilokuluja eikä teknistä jargonia.
          </p>

          <div className="animate-fade-slide-in-4 mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#kuvaile"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-base font-semibold text-[var(--nexa-navy)] shadow-[0_12px_32px_-12px_rgba(255,255,255,.55)] transition-colors hover:bg-[#efeafd]"
            >
              Tilaa ilmainen demo
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </a>
            <a
              href="#video"
              className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl px-6 text-base text-white ring-1 ring-white/25 transition-colors hover:bg-white/10"
            >
              <span className="grid size-6 place-items-center rounded-full bg-white/15">
                <Play className="size-3 translate-x-px" aria-hidden />
              </span>
              Katso video (30 s)
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5 text-sm text-white/80">
            {PROMISES.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <span className="grid size-5 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
                  <Check className="size-3.5" strokeWidth={3} aria-hidden />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <HeroShowcase />
      </div>

      <Industries />
    </section>
  );
}
