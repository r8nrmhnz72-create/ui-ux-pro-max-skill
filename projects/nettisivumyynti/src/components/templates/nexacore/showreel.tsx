import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

import { cn } from "@/lib/utils";

import { SectionHead } from "./section-head";

// Rendered from motion/scene.html with `npm run render:motion`.
// Relative paths so the files resolve both on the site root and next to the preview page.
const SRC_MP4 = "media/sivuseppa-motion.mp4";
const SRC_WEBM = "media/sivuseppa-motion.webm";
const POSTER = "media/sivuseppa-motion-poster.jpg";

// The video's scenes; also its text alternative.
const CHAPTERS = [
  { at: 0, label: "Asiakkaasi etsivät sinua netistä" },
  { at: 4.6, label: "Hidas sivu ajaa asiakkaat muualle" },
  { at: 9, label: "Rakennamme sivun, joka myy" },
  { at: 15.3, label: "Nopea, mobiilissa ja helppo löytää" },
  { at: 21, label: "Sivu, joka tuo asiakkaita" },
];

const stamp = (s: number) => `0:${String(Math.floor(s)).padStart(2, "0")}`;

export function Showreel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const triedBlob = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [chapter, setChapter] = useState(0);

  // Play muted while at least half of the video is on screen, unless the
  // visitor prefers reduced motion or has paused it themselves.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPaused.current) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.5 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      void video.play().catch(() => {});
    } else {
      userPaused.current = true;
      video.pause();
    }
  }

  function jump(at: number) {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = at;
    userPaused.current = false;
    void video.play().catch(() => {});
  }

  // If the page host refuses the direct file URLs, load the video as a blob instead.
  async function retryAsBlob() {
    const video = videoRef.current;
    if (!video || triedBlob.current) return;
    triedBlob.current = true;
    try {
      const mp4Ok = video.canPlayType("video/mp4") !== "";
      const res = await fetch(mp4Ok ? SRC_MP4 : SRC_WEBM);
      if (!res.ok) return;
      video.src = URL.createObjectURL(await res.blob());
      if (!userPaused.current) void video.play().catch(() => {});
    } catch {
      // The poster stays visible.
    }
  }

  return (
    <section id="video" className="overflow-hidden bg-white px-4 py-24 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <SectionHead chip="Video · 30 s" title="Mitä hyvä nettisivu tekee yrityksellesi?" align="left" />
          <p className="max-w-xl text-[var(--nexa-muted)] lg:justify-self-end lg:pb-2" style={{ fontSize: "clamp(16px, 1.2vw, 18px)", lineHeight: 1.6 }}>
            Puolessa minuutissa: miksi hidas sivu karkottaa asiakkaita, ja miten rakennamme tilalle nopean sivuston,
            joka tuo varauksia ja yhteydenottoja.
          </p>
        </div>

        <div className="relative mt-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-6 -inset-y-8 rounded-[48px] opacity-60 blur-3xl"
            style={{ background: "radial-gradient(50% 60% at 30% 40%, rgba(28,78,255,.35), transparent 70%), radial-gradient(45% 55% at 75% 60%, rgba(172,36,255,.35), transparent 70%)" }}
          />
          <div className="relative overflow-hidden rounded-[28px] bg-[var(--nexa-ink)] p-1.5 shadow-[0_40px_80px_-40px_rgba(26,11,84,.65)] ring-1 ring-[var(--border)]">
            <video
              ref={videoRef}
              className="block aspect-video w-full rounded-[22px] bg-[var(--nexa-ink)]"
              poster={POSTER}
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Video: mitä hyvä nettisivu tekee yrityksellesi"
              aria-describedby="video-chapters"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onTimeUpdate={(e) => {
                const t = e.currentTarget.currentTime;
                let i = 0;
                CHAPTERS.forEach((c, idx) => {
                  if (t >= c.at) i = idx;
                });
                setChapter(i);
              }}
            >
              <source src={SRC_MP4} type="video/mp4" />
              <source src={SRC_WEBM} type="video/webm" onError={() => void retryAsBlob()} />
            </video>
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Pysäytä video" : "Toista video"}
              className={cn(
                "absolute bottom-5 left-5 grid size-12 cursor-pointer place-items-center rounded-full bg-white/90 text-[var(--nexa-navy)] shadow-lg backdrop-blur transition-transform hover:scale-105 sm:bottom-6 sm:left-6",
                !playing && "sm:size-16",
              )}
            >
              {playing ? <Pause className="size-5" aria-hidden /> : <Play className="size-6 translate-x-px" aria-hidden />}
            </button>
          </div>
        </div>

        <ol id="video-chapters" aria-label="Videon kohtaukset" className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {CHAPTERS.map((c, i) => (
            <li key={c.at}>
              <button
                type="button"
                onClick={() => jump(c.at)}
                aria-current={i === chapter ? "step" : undefined}
                className={cn(
                  "flex min-h-12 w-full cursor-pointer items-start gap-3 rounded-xl px-3.5 py-3 text-left text-sm ring-1 transition-colors",
                  i === chapter
                    ? "bg-[var(--nexa-navy)] text-white ring-[var(--nexa-navy)]"
                    : "bg-[var(--nexa-surface)] text-[var(--nexa-navy)] ring-[var(--border)] hover:bg-[#ece8f8]",
                )}
              >
                <span className={cn("shrink-0 font-semibold tabular-nums", i === chapter ? "text-[var(--nexa-lavender-2)]" : "text-[var(--nexa-muted)]")}>
                  {stamp(c.at)}
                </span>
                <span>{c.label}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
