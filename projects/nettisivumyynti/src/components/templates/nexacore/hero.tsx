import { ArrowRight } from "lucide-react";

import { ContactButton, GradientText } from "./primitives";

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_115655_b4d9cd77-feed-43cd-a198-af78ebdf1f7a.mp4";

export function Hero() {
  return (
    <section
      id="home"
      data-slot="hero"
      className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 pt-28 pb-20"
      style={{
        // Shown until (or instead of) the video, e.g. when it can't load.
        background:
          "radial-gradient(60% 50% at 20% 20%, rgba(28,78,255,.55), transparent 70%), radial-gradient(50% 50% at 85% 30%, rgba(172,36,255,.5), transparent 70%), radial-gradient(60% 40% at 50% 100%, rgba(254,136,27,.35), transparent 70%), #0b0526",
      }}
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={HERO_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/25" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-48"
        style={{
          background: "linear-gradient(to bottom, transparent, #000201)",
        }}
      />

      <div className="relative z-10 flex max-w-2xl flex-col items-center gap-6 text-center">
        <GradientText className="text-lg font-medium">
          Nettisivut yrityksille kiinteään hintaan
        </GradientText>

        <h1
          className="font-medium leading-tight text-white text-balance"
          style={{ fontSize: "clamp(34px, 4.6vw, 64px)" }}
        >
          Nettisivut, jotka tuovat asiakkaita.
        </h1>

        <p
          className="text-[var(--nexa-lavender-2)]"
          style={{ fontSize: "clamp(16px, 1.25vw, 20px)" }}
        >
          Suunnittelemme ja rakennamme yrityksellesi nopean, hakukoneystävällisen
          ja mobiilissa toimivan sivuston. Valmis jopa kahdessa viikossa, ilman
          piilokuluja.
        </p>

        <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
          <ContactButton label="Pyydä ilmainen tarjous" href="#yhteys" />
          <a
            href="#hinnat"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-base text-white ring-1 ring-white/30 transition-colors hover:bg-white/10"
          >
            Katso hinnat
            <ArrowRight className="size-4" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
