import type { ReactNode } from "react";
import {
  ArrowRight,
  CalendarCheck,
  Camera,
  ChartColumn,
  Check,
  Languages,
  PenLine,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { ScoreRing } from "./hero";
import { SectionHead } from "./section-head";

const EXTRAS = [
  { icon: ShoppingBag, label: "Verkkokauppa" },
  { icon: CalendarCheck, label: "Ajanvaraus" },
  { icon: Languages, label: "Monikielisyys" },
  { icon: PenLine, label: "Tekstit" },
  { icon: Camera, label: "Kuvaus" },
  { icon: ChartColumn, label: "Analytiikka" },
];

function Card({ label, title, text, visual, className }: { label: string; title: string; text: string; visual: ReactNode; className?: string }) {
  return (
    <article
      className={cn(
        "relative flex flex-col gap-6 overflow-hidden rounded-[28px] bg-white/[0.04] p-5 ring-1 ring-white/10 sm:p-7",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{ background: "radial-gradient(80% 100% at 50% 0%, rgba(200,111,255,.16), transparent 70%)" }}
      />
      <div aria-hidden className="relative">
        {visual}
      </div>
      <div className="relative">
        <p className="text-sm font-medium text-[var(--nexa-accent)]">{label}</p>
        <h3 className="mt-2 text-xl font-semibold tracking-[-0.01em] text-white sm:text-2xl">{title}</h3>
        <p className="mt-2 max-w-md text-[15px] leading-relaxed text-[var(--nexa-lavender-2)]">{text}</p>
      </div>
    </article>
  );
}

function DesignVisual() {
  const swatches = ["#1a0b54", "#1c4eff", "#ac24ff", "#fe881b", "#f6f4fb"];
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_1.25fr]">
      <div className="flex flex-col justify-between gap-5 rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10">
        <div className="flex -space-x-2.5">
          {swatches.map((c) => (
            <span key={c} className="size-10 rounded-full ring-[3px] ring-[#140a3d]" style={{ background: c }} />
          ))}
        </div>
        <div className="flex items-end gap-4 text-white">
          <span className="text-5xl font-semibold leading-none tracking-tight">Aa</span>
          <span className="nexa-serif text-5xl leading-none">Aa</span>
          <span className="pb-1 text-xs leading-5 text-white/55">
            Otsikot
            <br />
            ja leipäteksti
          </span>
        </div>
      </div>
      <div className="rounded-2xl bg-white p-3.5">
        <div className="flex items-center justify-between">
          <span className="size-4 rounded-full bg-[#1a0b54]" />
          <span className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1.5 w-7 rounded-full bg-[#e8e4f3]" />
            ))}
          </span>
          <span className="h-4 w-12 rounded-full bg-[#1c4eff]" />
        </div>
        <div className="mt-4 h-2.5 w-3/4 rounded-full bg-[#1a0b54]" />
        <div className="mt-2 h-2.5 w-1/2 rounded-full bg-[#1a0b54]" />
        <div className="mt-3 h-1.5 w-2/3 rounded-full bg-[#e8e4f3]" />
        <div className="mt-4 grid grid-cols-3 gap-2">
          {["#efeafd", "#fde8d7", "#e3ecff"].map((c) => (
            <span key={c} className="h-12 rounded-lg" style={{ background: c }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SpeedVisual() {
  const rows = [
    { icon: Zap, text: "Latautuu alle sekunnissa" },
    { icon: Smartphone, text: "Suunniteltu puhelimelle" },
    { icon: ShieldCheck, text: "Saavutettava ja turvallinen" },
  ];
  return (
    <div className="flex items-center gap-5 rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10">
      <ScoreRing value={98} size={80} track="rgba(255,255,255,.12)" color="#fff" />
      <ul className="space-y-2 text-sm text-white/80">
        {rows.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-2">
            <Icon className="size-4 shrink-0 text-[var(--nexa-lavender-2)]" />
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SeoVisual() {
  return (
    <div className="rounded-2xl bg-white p-3.5 text-[#202124]">
      <div className="flex items-center gap-2 rounded-full border border-[#dfe1e5] px-3 py-2 text-[13px] text-[#4d5156]">
        <Search className="size-4 text-[#5f6368]" />
        kahvila tampere
      </div>
      <div className="mt-3 rounded-xl bg-[#f3f0fc] p-3 ring-1 ring-[#1c4eff]/25">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-xs text-[#4d5156]">
            <span className="nexa-grad-a-bg size-4 rounded-full" />
            sivustosi.fi
          </span>
          <span className="rounded-md bg-[#1c4eff] px-1.5 py-0.5 text-[11px] font-bold text-white">#1</span>
        </div>
        <p className="mt-1 text-[15px] font-medium text-[#1a0dab]">Kahvila Kaneli – kahvila Tampereella</p>
        <p className="mt-0.5 text-xs text-[#4d5156]">Avoinna tänään 8–18 · Lounas arkisin 10.30–14</p>
      </div>
      <div className="mt-3 space-y-2 px-3">
        <div className="h-2 w-2/3 rounded-full bg-[#ececf1]" />
        <div className="h-2 w-1/2 rounded-full bg-[#ececf1]" />
      </div>
    </div>
  );
}

function CareVisual() {
  const log = [
    { text: "Varmuuskopio tehty", time: "03.00" },
    { text: "Lisäosat päivitetty", time: "09.12" },
    { text: "Tietoturvatarkistus", time: "OK" },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-[1.1fr_1fr]">
      <ul className="space-y-2">
        {log.map(({ text, time }) => (
          <li key={text} className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.05] px-3.5 py-3 text-sm text-white/85 ring-1 ring-white/10">
            <span className="flex items-center gap-2.5">
              <span className="grid size-5 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
                <Check className="size-3.5" strokeWidth={3} />
              </span>
              {text}
            </span>
            <span className="text-xs tabular-nums text-white/55">{time}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-col justify-center gap-2 rounded-xl bg-white/[0.05] p-3.5 text-sm ring-1 ring-white/10">
        <p className="w-fit max-w-[90%] rounded-2xl rounded-bl-md bg-white/10 px-3.5 py-2 text-white/90">Voitteko vaihtaa joulun aukioloajat?</p>
        <p className="nexa-grad-a-bg ml-auto w-fit max-w-[90%] rounded-2xl rounded-br-md px-3.5 py-2 text-white">Hoidettu! Muutos on jo sivulla.</p>
      </div>
    </div>
  );
}

export function Services() {
  return (
    <section
      id="build"
      className="relative overflow-hidden text-white"
      style={{
        background:
          "radial-gradient(60% 40% at 80% 0%, rgba(172,36,255,.22), transparent 70%), radial-gradient(50% 40% at 0% 60%, rgba(28,78,255,.18), transparent 70%), linear-gradient(var(--nexa-ink), var(--nexa-ink-2) 55%, var(--nexa-ink))",
      }}
    >
      <div className="relative mx-auto max-w-[1200px] px-4 py-24 sm:px-6 lg:py-32">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <SectionHead chip="Palvelut" title="Kaikki, mitä yrityksesi tarvitsee verkossa." align="left" tone="dark" />
          <p className="max-w-xl text-[var(--nexa-lavender-2)] lg:justify-self-end lg:pb-2" style={{ fontSize: "clamp(16px, 1.2vw, 18px)", lineHeight: 1.6 }}>
            Yksi kumppani suunnittelusta ylläpitoon. Sinun ei tarvitse ymmärtää tekniikkaa, riittää että tunnet
            asiakkaasi.
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          <Card
            className="lg:col-span-2"
            label="Suunnittelu"
            title="Brändisi näköinen ulkoasu, ei valmispohjaa."
            text="Suunnittelemme ulkoasun yrityksesi värien ja tyylin pohjalta. Saat luonnoksen kommentoitavaksi ennen kuin mitään rakennetaan."
            visual={<DesignVisual />}
          />
          <Card
            label="Toteutus"
            title="Nopea sivusto, jota päivität itse."
            text="Kevyt koodi ja optimoidut kuvat. Tavoitteena 90+ pistettä Googlen nopeustestissä."
            visual={<SpeedVisual />}
          />
          <Card
            label="Näkyvyys"
            title="Asiakkaat löytävät sinut Googlesta."
            text="Hakukoneoptimointi, Google-yritysprofiili ja rakenteinen data kuuluvat jokaiseen pakettiin."
            visual={<SeoVisual />}
          />
          <Card
            className="lg:col-span-2"
            label="Ylläpito"
            title="Me huolehdimme sivustosta, sinä bisneksestä."
            text="Päivitykset, varmuuskopiot ja tietoturva hoituvat taustalla. Muutospyynnöt hoidetaan suomeksi, yleensä saman päivän aikana."
            visual={<CareVisual />}
          />
        </div>

        <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-wrap gap-2.5" aria-label="Lisäpalvelut">
            {EXTRAS.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-3.5 py-2 text-sm text-white/80 ring-1 ring-white/10">
                <Icon className="size-4 text-[var(--nexa-lavender-2)]" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
          <a href="#tyot" className="group inline-flex min-h-11 items-center gap-2 self-start font-medium text-white lg:self-auto">
            Katso, miltä sinun sivusi voisi näyttää
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
