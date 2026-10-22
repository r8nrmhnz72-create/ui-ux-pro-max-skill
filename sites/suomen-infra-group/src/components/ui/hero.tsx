"use client"

import { DotGrid, MeshGradient, PulsingBorder } from "@paper-design/shaders-react"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight, HardHat } from "lucide-react"

import { cn } from "@/lib/utils"

/*
 * Shader hero, adapted from the 21st.dev "ShaderShowcase" component.
 *
 * Changes from the original:
 * - Updated to the current @paper-design/shaders-react API (the `wireframe`,
 *   `backgroundColor` and `spotsPerColor` props were removed upstream). The
 *   wireframe mesh layer is replaced with a DotGrid, like a site-plan grid.
 * - All copy, links and colors come from props, so the hero is reusable.
 * - Respects prefers-reduced-motion: shaders freeze and loops stop.
 * - Particle positions are fixed instead of Math.random() on every render.
 * - Links are real <a> elements, text sits on a dark scrim for contrast,
 *   and the layout flows on phones instead of absolutely placed text.
 * - No emoji; icons come from lucide-react.
 */

export type HeroLink = { label: string; href: string }

export type HeroProps = {
  brandName?: string
  brandHref?: string
  navLinks?: HeroLink[]
  headerCta?: HeroLink
  badge?: string
  titleLead?: string
  titleMain?: string
  titleTail?: string
  description?: string
  primaryCta?: HeroLink
  secondaryCta?: HeroLink
  ringText?: string
  /** Mesh gradient colors, dark to bright. */
  colors?: string[]
  /** Colors for the pulsing badge in the corner. */
  accentColors?: string[]
  className?: string
}

const PARTICLES = [
  { left: "24%", top: "30%", dx: 6 },
  { left: "68%", top: "22%", dx: -8 },
  { left: "40%", top: "70%", dx: 4 },
  { left: "78%", top: "64%", dx: -5 },
  { left: "30%", top: "50%", dx: 9 },
  { left: "58%", top: "42%", dx: -3 },
]

export default function ShaderShowcase({
  brandName = "Suomen Infra Group",
  brandHref = "#top",
  navLinks = [
    { label: "Palvelut", href: "#palvelut" },
    { label: "Henkilöstövuokraus", href: "#henkilostovuokraus" },
  ],
  headerCta = { label: "Pyydä tarjous", href: "#tarjouspyynto" },
  badge = "Henkilöstövuokraus ja infrarakentaminen",
  titleLead = "Osaavat tekijät",
  titleMain = "työmaallesi",
  titleTail = "Infra alusta loppuun",
  description = "Vuokraamme rakennus- ja infra-alan ammattilaisia ja toteutamme infraurakoita. Kerro, mitä työmaallasi tarvitaan, niin palaamme asiaan nopeasti.",
  primaryCta = { label: "Pyydä työntekijöitä", href: "#tarjouspyynto" },
  secondaryCta = { label: "Tutustu palveluihin", href: "#palvelut" },
  ringText = "SUOMEN INFRA GROUP • INFRA • HENKILÖSTÖ • ",
  colors = ["#0b1220", "#1e293b", "#334155", "#c2410c", "#f97316"],
  accentColors = ["#f97316", "#ea580c", "#fbbf24", "#ffffff"],
  className,
}: HeroProps) {
  const reduceMotion = useReducedMotion() ?? false
  const loop = reduceMotion ? 0 : Number.POSITIVE_INFINITY

  return (
    <div className={cn("relative isolate flex min-h-[640px] flex-col overflow-hidden bg-[#0b1220] md:min-h-[88svh]", className)}>
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <defs>
          <filter id="gooey-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="gooey" />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
          <filter id="text-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Shader background */}
      <MeshGradient
        className="absolute inset-0 -z-20 h-full w-full"
        colors={colors}
        speed={reduceMotion ? 0 : 0.3}
        distortion={0.8}
        swirl={0.15}
        aria-hidden="true"
      />
      <DotGrid
        className="absolute inset-0 -z-10 h-full w-full opacity-40"
        colorBack="#00000000"
        colorFill="#ffffff"
        colorStroke="#00000000"
        size={1.5}
        gapX={28}
        gapY={28}
        opacityRange={0.6}
        aria-hidden="true"
      />
      {/* Scrim so text keeps 4.5:1 contrast over the moving gradient */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-tr from-black/80 via-black/45 to-black/10"
        aria-hidden="true"
      />

      <header className="relative z-20 wrap flex w-full flex-wrap items-center justify-between gap-4 py-5">
        <motion.a
          href={brandHref}
          className="group relative flex min-h-11 items-center gap-3 rounded-md text-white no-underline"
          whileHover={reduceMotion ? undefined : { scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 12 }}
        >
          <span className="grid size-10 place-items-center rounded-md bg-primary text-black">
            <HardHat className="size-6" strokeWidth={2.2} aria-hidden="true" />
          </span>
          <span className="font-display text-lg font-extrabold tracking-wide">{brandName}</span>
          <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true">
            {PARTICLES.map((p, i) => (
              <motion.span
                key={i}
                className="absolute h-1 w-1 rounded-full bg-white/60"
                style={{ left: p.left, top: p.top }}
                animate={reduceMotion ? undefined : { y: [-6, -16, -6], x: [0, p.dx, 0], opacity: [0, 1, 0], scale: [0, 1, 0] }}
                transition={{ duration: 2, repeat: loop, delay: i * 0.2, ease: "easeInOut" }}
              />
            ))}
          </span>
        </motion.a>

        <nav aria-label="Päävalikko" className="flex flex-wrap items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-white/85 transition-colors duration-200 hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </a>
          ))}

          {/* Gooey CTA: the arrow pill slides out of the button on hover */}
          <div className="group relative ml-2 flex items-center" style={{ filter: "url(#gooey-filter)" }}>
            <span
              className="absolute right-0 z-0 flex h-11 w-11 -translate-x-10 items-center justify-center rounded-full bg-primary text-black transition-transform duration-300 group-hover:-translate-x-[8.5rem]"
              aria-hidden="true"
            >
              <ArrowUpRight className="size-4" />
            </span>
            <a
              href={headerCta.href}
              className="relative z-10 inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-bold text-black transition-colors duration-300 hover:bg-[#fb923c]"
            >
              {headerCta.label}
            </a>
          </div>
        </nav>
      </header>

      <main className="relative z-20 wrap mt-auto w-full pb-12 pt-16 md:pb-16">
        <div className="max-w-3xl">
          <motion.p
            className="mb-6 inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold tracking-wide text-white/90 backdrop-blur-sm"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="mr-2 inline-block size-2 rounded-full bg-primary" aria-hidden="true" />
            {badge}
          </motion.p>

          <motion.h1
            className="mb-6 font-display text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl"
            initial={reduceMotion ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.span
              className="mb-2 block text-3xl font-light tracking-wide sm:text-4xl lg:text-5xl"
              style={{
                background: "linear-gradient(120deg, #ffffff 0%, #fdba74 35%, #f97316 65%, #ffffff 100%)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "url(#text-glow)",
              }}
              animate={reduceMotion ? undefined : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 8, repeat: loop, ease: "linear" }}
            >
              {titleLead}
            </motion.span>
            <span className="block drop-shadow-2xl">{titleMain}</span>
            <span className="block font-light italic text-white/85">{titleTail}</span>
          </motion.h1>

          <motion.p
            className="mb-8 max-w-xl text-lg leading-relaxed text-white/85"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {description}
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <motion.a
              href={primaryCta.href}
              className="inline-flex min-h-12 items-center rounded-full bg-primary px-8 text-base font-bold text-black shadow-lg transition-colors duration-300 hover:bg-[#fb923c]"
              whileHover={reduceMotion ? undefined : { scale: 1.04 }}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            >
              {primaryCta.label}
            </motion.a>
            <motion.a
              href={secondaryCta.href}
              className="inline-flex min-h-12 items-center rounded-full border-2 border-white/40 px-8 text-base font-semibold text-white backdrop-blur-sm transition-colors duration-300 hover:border-white hover:bg-white/10"
              whileHover={reduceMotion ? undefined : { scale: 1.04 }}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            >
              {secondaryCta.label}
            </motion.a>
          </motion.div>
        </div>
      </main>

      {/* Pulsing badge with rotating text (decorative) */}
      <div className="absolute bottom-10 right-10 z-30 hidden md:block" aria-hidden="true">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <PulsingBorder
            colors={accentColors}
            colorBack="#00000000"
            speed={reduceMotion ? 0 : 1.5}
            roundness={1}
            thickness={0.1}
            softness={0.2}
            intensity={5}
            spots={5}
            spotSize={0.1}
            pulse={0.1}
            smoke={0.5}
            smokeSize={4}
            scale={0.65}
            style={{ width: "64px", height: "64px", borderRadius: "50%" }}
          />
          <motion.svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 20, repeat: loop, ease: "linear" }}
            style={{ scale: 1.5 }}
          >
            <defs>
              <path id="hero-ring" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
            </defs>
            <text className="fill-white/80 font-display text-[7.5px] font-semibold tracking-[0.12em]">
              <textPath href="#hero-ring" startOffset="0%">
                {ringText}
              </textPath>
            </text>
          </motion.svg>
        </div>
      </div>
    </div>
  )
}
