"use client";

import dynamic from "next/dynamic";

// three.js is only needed for this decorative layer, so it is split out of the page bundle
// and fetched after hydration; the hero text never waits for it.
const ParticleWave = dynamic(() => import("@/components/ui/particle-wave").then((module) => module.ParticleWave), {
  ssr: false,
});

export function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <ParticleWave
        speed={0.3}
        size={1.35}
        opacity={0.6}
        className="peer absolute inset-0 text-foreground opacity-0 transition-opacity duration-[1600ms] ease-out data-[ready=true]:opacity-100 motion-reduce:transition-none"
      />
      {/* Shown only if WebGL is unavailable and the canvas has hidden itself: a quiet field of dots. */}
      <div
        className="absolute inset-0 hidden peer-[[hidden]]:block"
        style={{
          backgroundImage: "radial-gradient(circle, color-mix(in oklab, var(--foreground) 26%, transparent) 1px, transparent 1.6px)",
          backgroundSize: "22px 22px",
          maskImage: "radial-gradient(120% 90% at 85% 10%, black, transparent 72%)",
          WebkitMaskImage: "radial-gradient(120% 90% at 85% 10%, black, transparent 72%)",
        }}
      />
    </div>
  );
}
