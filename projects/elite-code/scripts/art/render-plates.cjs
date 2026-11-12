#!/usr/bin/env node
/**
 * render-plates.cjs — artwork for the template picker (the kaiten-sushi belt).
 *
 * Generates public/plates/<id>.webp for the eight website templates: an 880 x 880 px
 * WebP with alpha, showing a round plate seen from straight above (diameter 96 % of the
 * canvas, everything outside the disc fully transparent) with a miniature website mockup
 * lying on it. The ids match `templates` in content/site.ts.
 *
 * How it works: every plate is plain HTML/CSS/SVG, rendered in headless Chromium at 2x on
 * a transparent background, downsampled and trimmed to an exact circle with sharp, then
 * encoded as WebP. No photos, no external images; the only network access is Google Fonts.
 * The output is deterministic (seeded speckles, fixed font list).
 *
 * Run from the project root:
 *   node scripts/art/render-plates.cjs                    # all eight plates
 *   node scripts/art/render-plates.cjs --only=paja,kauppa # just some of them
 *   node scripts/art/render-plates.cjs --png=/tmp/plates  # also write lossless PNG copies there
 *
 * Needs `sharp` (already a dependency of Next.js) and Playwright with Chromium:
 *   npm i -D playwright && npx playwright install chromium
 *
 * The small belt versions (<id>-sm.webp) are derived from these files, so run
 * `node scripts/art/resize-plates.cjs` afterwards. Preview: /dev/plates in `next dev`.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..", "..");
const OUT_DIR = path.join(ROOT, "public", "plates");

const SIZE = 880; // canvas edge in px
const SUPERSAMPLE = 2; // render scale before downsampling
const R = (SIZE * 0.96) / 2; // disc radius: 96 % of the canvas
const BLEED = 5; // the disc is painted this much larger, the mask trims it to R
const RW = R * 0.92; // radius of the well; the rim is 8 % of the radius
const CARD_W = 580; // mockup card, 66 % of the canvas, 4:3
const CARD_H = 435;
const BUDGET = 70 * 1024; // target file size per plate
const QUALITIES = [86, 84, 82, 80, 78, 76];

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Geist:wght@300..800&family=Geist+Mono:wght@400..600" +
  "&family=Instrument+Serif:ital@0;1&family=Barlow+Condensed:wght@600;700" +
  "&family=Bricolage+Grotesque:opsz,wght@12..96,500..800&display=block";
/** Every face the mockups use. Rendering aborts if one of them fails to load. */
const FONT_FACES = [
  '400 16px "Geist"',
  '500 16px "Geist"',
  '600 16px "Geist"',
  '700 16px "Geist"',
  '500 16px "Geist Mono"',
  '400 16px "Instrument Serif"',
  'italic 400 16px "Instrument Serif"',
  '700 16px "Barlow Condensed"',
  '800 16px "Bricolage Grotesque"',
];

/* ------------------------------------------------------------------ helpers */

/** Small seeded PRNG so the speckled glazes are identical on every run. */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const px = (n) => `${Number(n.toFixed(2))}px`;

/** Stroke icon on a 24 grid. */
function icon(paths, size, stroke = 1.9, extra = "") {
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" ${extra}>${paths}</svg>`;
}

const ICONS = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  arrowUp: '<path d="M7 17 17 7M9 7h8v8"/>',
  chevronL: '<path d="M14.5 6 8.5 12l6 6"/>',
  chevronR: '<path d="M9.5 6l6 6-6 6"/>',
  phone:
    '<path d="M6.7 3.5h2.5l1.4 3.7-1.8 1.3a11.4 11.4 0 0 0 4.7 4.7l1.3-1.8 3.7 1.4v2.5a2 2 0 0 1-2.2 2A15.6 15.6 0 0 1 4.7 5.7a2 2 0 0 1 2-2.2z"/>',
  hammer: '<path d="m14.2 4.2 5.6 5.6-2.4 2.4-5.6-5.6z"/><path d="M13 8.6 4.4 17.2a1.7 1.7 0 0 0 2.4 2.4L15.4 11"/>',
  drop: '<path d="M12 3.6c3 3.5 5.6 6.5 5.6 9.8a5.6 5.6 0 0 1-11.2 0c0-3.3 2.6-6.3 5.6-9.8z"/>',
  roller: '<rect x="3.5" y="4" width="13.5" height="6" rx="1.6"/><path d="M17 7h3v5.2h-8V15"/><rect x="10.3" y="15" width="3.4" height="5.6" rx="1.1"/>',
  search: '<circle cx="11" cy="11" r="6.2"/><path d="m20 20-4.4-4.4"/>',
  cart: '<path d="M3 4.5h2.4l2.3 10.3h9.9l2-7.4H6.6"/><circle cx="9.3" cy="19" r="1.5"/><circle cx="16.4" cy="19" r="1.5"/>',
  plus: '<path d="M12 5.5v13M5.5 12h13"/>',
  check: '<path d="m5.5 12.5 4.2 4.2 8.8-9.4"/>',
  spark: '<path d="M12 2.8c.6 5 2.2 6.6 9.2 9.2-7 2.6-8.6 4.2-9.2 9.2-.6-5-2.2-6.6-9.2-9.2 7-2.6 8.6-4.2 9.2-9.2z"/>',
};

/* ------------------------------------------------------------------ plates */

/**
 * Glaze of each plate. `rim*` shade the rim from the lit top-left to the bottom-right,
 * `well*` do the same for the recessed centre, `edge` is the fine line that keeps the
 * plate readable on white, on the dialog card and on the dark belt.
 */
const GLAZES = {
  kipina: {
    dark: false, rim: "#F8EDD6", rimHi: "#FFFAEC", rimLo: "#E2D2B3", well: "#F7EBD2", wellHi: "#FBF2DE", wellLo: "#EDDFC3",
    edgeHi: "#CDBD9C", edgeLo: "#A38F68", edgeW: 3.2, gloss: 0.55, grain: 0.05,
  },
  paja: {
    dark: true, rim: "#3E4146", rimHi: "#60646A", rimLo: "#26282B", well: "#35383C", wellHi: "#404348", wellLo: "#2C2E32",
    edgeHi: "#BDC0C5", edgeLo: "#6F7278", edgeW: 3.6, gloss: 0.22, grain: 0.1,
    speckle: [
      { seed: 11, count: 420, color: "#0E0F10", min: 0.5, max: 2, alpha: 0.5 },
      { seed: 23, count: 260, color: "#D5D7DB", min: 0.4, max: 1.3, alpha: 0.34 },
    ],
  },
  kattaus: {
    dark: false, rim: "#EDE0C3", rimHi: "#FAF1DB", rimLo: "#D5C4A0", well: "#ECDEC0", wellHi: "#F4E8CD", wellLo: "#E0D0AE",
    edgeHi: "#A9865A", edgeLo: "#7A5A36", edgeW: 4.6, gloss: 0.42, grain: 0.07, toast: "rgba(150,108,62,.34)",
    speckle: [{ seed: 5, count: 340, color: "#5E4427", min: 0.5, max: 2.3, alpha: 0.6 }],
  },
  galleria: {
    dark: false, rim: "#FAFAF7", rimHi: "#FFFFFF", rimLo: "#E0E0DB", well: "#F8F8F4", wellHi: "#FCFCFA", wellLo: "#EDEDE8",
    edgeHi: "#141416", edgeLo: "#0B0B0C", edgeW: 5.4, gloss: 0.8, grain: 0,
  },
  vastaanotto: {
    dark: false, rim: "#D8EFE6", rimHi: "#F0FCF7", rimLo: "#B9DACE", well: "#D6EDE4", wellHi: "#E1F4ED", wellLo: "#C6E2D8",
    edgeHi: "#93C4B5", edgeLo: "#6BA391", edgeW: 3.2, gloss: 0.7, grain: 0.03,
  },
  toimisto: {
    dark: false, rim: "#F3F0E6", rimHi: "#FFFEF8", rimLo: "#DAD5C6", well: "#F2EEE3", wellHi: "#F8F5EC", wellLo: "#E6E1D3",
    edgeHi: "#1B2F58", edgeLo: "#101D38", edgeW: 5.4, gloss: 0.6, grain: 0.03,
  },
  kauppa: {
    dark: false, rim: "#FBFBFD", rimHi: "#FFFFFF", rimLo: "#DFDFE8", well: "#F8F8FB", wellHi: "#FDFDFE", wellLo: "#ECECF3",
    edgeHi: "#C2C3D0", edgeLo: "#9697A8", edgeW: 3.2, gloss: 0.85, grain: 0, pinstripe: "rgba(120,118,196,.34)",
  },
  mittatilaus: {
    dark: true, rim: "#17171A", rimHi: "#313136", rimLo: "#09090A", well: "#111113", wellHi: "#1A1A1D", wellLo: "#0B0B0C",
    edgeHi: "#F6DA7C", edgeLo: "#B4852A", edgeW: 6.5, gloss: 0.5, grain: 0,
  },
};

/** Iron flecks of a stoneware glaze: seeded, so every run paints the same dots. */
function speckles(specs) {
  if (!specs) return "";
  const c = R + BLEED;
  let groups = "";
  for (const spec of specs) {
    const rand = mulberry32(spec.seed);
    let dots = "";
    for (let i = 0; i < spec.count; i++) {
      const radius = Math.sqrt(rand()) * (R - 3);
      const angle = rand() * Math.PI * 2;
      const size = spec.min + Math.pow(rand(), 2.4) * (spec.max - spec.min);
      const alpha = spec.alpha * (0.35 + 0.65 * rand());
      const stretch = 0.7 + rand() * 0.6;
      dots += `<ellipse cx="${(c + Math.cos(angle) * radius).toFixed(1)}" cy="${(c + Math.sin(angle) * radius).toFixed(1)}" rx="${size.toFixed(2)}" ry="${(size * stretch).toFixed(2)}" opacity="${alpha.toFixed(2)}"/>`;
    }
    groups += `<g fill="${spec.color}">${dots}</g>`;
  }
  return `<svg class="p-layer" viewBox="0 0 ${2 * c} ${2 * c}">${groups}</svg>`;
}

function grain(glaze) {
  if (!glaze.grain) return "";
  const v = glaze.dark ? 1 : 0;
  return `<svg class="p-layer" style="opacity:${glaze.grain}">
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="4"/>
      <feColorMatrix values="0 0 0 0 ${v}  0 0 0 0 ${v}  0 0 0 0 ${v}  0 0 0 1.6 -0.3"/>
    </filter>
    <rect width="100%" height="100%" filter="url(#grain)"/>
  </svg>`;
}

/** The plate itself: rim, inner wall, recessed well, glaze sheen and the edge line. */
function plate(glaze) {
  const g = glaze;
  const rimOuter = R - g.edgeW; // where the rim meets the edge line
  const rimMid = (RW + rimOuter) / 2;
  const hi = (a) => `rgba(255,255,255,${a})`;
  const lo = (a) => `rgba(0,0,0,${a})`;
  const ring = (inner, outer, soft = 0.8) =>
    `radial-gradient(circle at 50% 50%, transparent ${px(inner - soft)}, #000 ${px(inner + soft)}, #000 ${px(outer - soft)}, transparent ${px(outer + soft)})`;
  const softRing = (inner, mid, outer) =>
    `radial-gradient(circle at 50% 50%, transparent ${px(inner)}, #000 ${px(mid)}, transparent ${px(outer)})`;
  const mask = (value) => `-webkit-mask:${value};mask:${value}`;

  const wallShade = g.dark ? lo(0.62) : lo(0.2);
  const wallLight = g.dark ? hi(0.2) : hi(0.95);
  const wellShade = g.dark ? lo(0.6) : "rgba(70,52,24,.2)";
  const wellLight = g.dark ? hi(0.07) : hi(0.75);
  const rimGlow = g.dark ? 0.16 * (0.5 + g.gloss) : 0.5 + 0.4 * g.gloss;
  const lipHi = g.dark ? 0.5 : 0.95;
  const sheen = g.dark ? 0.1 + 0.12 * g.gloss : 0.18 + 0.3 * g.gloss;

  return `
  <div class="p-layer" style="background:conic-gradient(from 315deg, ${g.rimHi} 0deg, ${g.rim} 95deg, ${g.rimLo} 180deg, ${g.rim} 265deg, ${g.rimHi} 360deg)"></div>
  <div class="p-layer" style="background:conic-gradient(from 315deg, ${hi(rimGlow)} 0deg, ${hi(rimGlow * 0.25)} 110deg, ${hi(0)} 180deg, ${hi(rimGlow * 0.25)} 250deg, ${hi(rimGlow)} 360deg);${mask(softRing(RW + 3, rimMid + 2, rimOuter - 1))}"></div>
  ${g.toast ? `<div class="p-layer" style="background:${g.toast};${mask(`radial-gradient(circle at 50% 50%, transparent ${px(rimOuter - 13)}, #000 ${px(rimOuter + 1)})`)}"></div>` : ""}
  ${g.pinstripe ? `<div class="p-layer" style="background:${g.pinstripe};${mask(ring(rimMid + 4, rimMid + 6.2, 0.7))}"></div>` : ""}
  <div class="p-well" style="width:${px(2 * RW)};height:${px(2 * RW)};background:linear-gradient(135deg, ${g.wellHi} 8%, ${g.well} 50%, ${g.wellLo} 94%);box-shadow:inset 13px 16px 30px -8px ${wellShade}, inset -10px -13px 26px -10px ${wellLight}"></div>
  <div class="p-layer" style="background:conic-gradient(from 315deg, ${wallShade} 0deg, transparent 82deg, ${wallLight} 180deg, transparent 278deg, ${wallShade} 360deg);${mask(softRing(RW - 9, RW, RW + 8))}"></div>
  ${speckles(g.speckle)}
  ${grain(g)}
  <div class="p-layer" style="background:radial-gradient(58% 46% at 27% 21%, ${hi(sheen)}, ${hi(0)} 72%), radial-gradient(60% 50% at 80% 84%, ${lo(g.dark ? 0.3 : 0.07)}, ${lo(0)} 70%)"></div>
  <div class="p-layer" style="background:conic-gradient(from 315deg, ${g.edgeHi} 0deg, ${g.edgeLo} 180deg, ${g.edgeHi} 360deg);${mask(`radial-gradient(circle at 50% 50%, transparent ${px(rimOuter - 0.7)}, #000 ${px(rimOuter + 0.7)})`)}"></div>
  <div class="p-layer" style="background:conic-gradient(from 315deg, ${hi(lipHi)} 0deg, ${hi(0)} 78deg, ${lo(g.dark ? 0.5 : 0.16)} 180deg, ${hi(0)} 282deg, ${hi(lipHi)} 360deg);${mask(ring(rimOuter - 3.2, rimOuter - 0.4, 0.9))}"></div>`;
}

/* ------------------------------------------------------------------ mockups */

const chrome = '<div class="chrome"><i></i><i></i><i></i><span class="url"><b></b></span></div>';

/** Abstract top-down bowl for the restaurant template. */
function dishSvg() {
  return `<svg class="dish" viewBox="0 0 220 220">
    <defs>
      <radialGradient id="soup" cx="42%" cy="38%" r="70%"><stop offset="0" stop-color="#E08A5C"/><stop offset="1" stop-color="#BE5A33"/></radialGradient>
      <radialGradient id="bowl" cx="36%" cy="30%" r="80%"><stop offset="0" stop-color="#FFF9EA"/><stop offset="1" stop-color="#E6D9BC"/></radialGradient>
    </defs>
    <ellipse cx="118" cy="122" rx="96" ry="94" fill="#0F2418" opacity=".55"/>
    <circle cx="110" cy="110" r="96" fill="url(#bowl)"/>
    <circle cx="110" cy="110" r="76" fill="none" stroke="#D4C5A2" stroke-width="2.5"/>
    <circle cx="110" cy="110" r="66" fill="url(#soup)"/>
    <path d="M78 104c10-22 44-26 56-8 9 14-4 30-20 28-11-1-16-11-9-18" fill="none" stroke="#FBEFD6" stroke-width="7" stroke-linecap="round" opacity=".92"/>
    <g fill="#6FA356"><ellipse cx="142" cy="128" rx="13" ry="6" transform="rotate(-34 142 128)"/><ellipse cx="128" cy="146" rx="11" ry="5" transform="rotate(18 128 146)"/></g>
    <ellipse cx="88" cy="138" rx="10" ry="4.6" transform="rotate(52 88 138)" fill="#4E8440"/>
    <g fill="#3A2416"><circle cx="96" cy="82" r="2"/><circle cx="150" cy="100" r="1.8"/><circle cx="118" cy="158" r="1.8"/><circle cx="70" cy="116" r="1.6"/><circle cx="134" cy="76" r="1.5"/></g>
    <path d="M38 78a80 80 0 0 1 46-50" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/>
  </svg>`;
}

/** Abstract products for the shop grid, drawn on a 160 x 100 stage. */
const PRODUCTS = [
  { bg: "#FFE2D4", price: "29 €", art: '<ellipse cx="80" cy="90" rx="34" ry="4.5" fill="#E9B9A2"/><circle cx="80" cy="60" r="28" fill="#E3674A"/><rect x="70" y="18" width="20" height="24" rx="4" fill="#E3674A"/><rect x="65" y="14" width="30" height="8" rx="4" fill="#C6513A"/><path d="M62 52a20 20 0 0 1 12-13" stroke="#FFB9A3" stroke-width="5" stroke-linecap="round" fill="none"/>' },
  { bg: "#D6F2E5", price: "18 €", art: '<ellipse cx="80" cy="90" rx="36" ry="4.5" fill="#A9D9C3"/><circle cx="106" cy="55" r="14" fill="none" stroke="#1E8A6C" stroke-width="7.5"/><rect x="52" y="26" width="52" height="62" rx="10" fill="#1E8A6C"/><rect x="52" y="44" width="52" height="9" fill="#EFFFF7"/><rect x="60" y="33" width="6" height="46" rx="3" fill="#48AE8F" opacity=".8"/>' },
  { bg: "#FFF0BE", price: "89 €", art: '<ellipse cx="80" cy="90" rx="30" ry="4.5" fill="#E6CF86"/><path d="M60 52h40l14 32H46z" fill="#FFE07A" opacity=".9"/><rect x="77.5" y="48" width="5" height="38" fill="#2B2A55"/><rect x="62" y="84" width="36" height="6.5" rx="3.2" fill="#2B2A55"/><path d="M68 16h24l12 36H56z" fill="#5B5BF0"/><path d="M71 20h8l-6 28h-9z" fill="#8585F6"/>' },
  { bg: "#DAE9FF", price: "35 €", art: '<ellipse cx="80" cy="91" rx="40" ry="4.5" fill="#B3CDF3"/><path d="M50 60V50a30 30 0 0 1 60 0v10" fill="none" stroke="#1D4FBF" stroke-width="7" stroke-linecap="round"/><rect x="40" y="52" width="21" height="34" rx="9" fill="#2F6FED"/><rect x="99" y="52" width="21" height="34" rx="9" fill="#2F6FED"/><rect x="56" y="57" width="6" height="24" rx="3" fill="#1D4FBF"/><rect x="98" y="57" width="6" height="24" rx="3" fill="#1D4FBF"/>' },
  { bg: "#FFDCEA", price: "24 €", art: '<ellipse cx="80" cy="90" rx="32" ry="4.5" fill="#F0B4CC"/><path d="M80 8c7 8 9 13 9 17a9 9 0 0 1-18 0c0-4 2-9 9-17z" fill="#FFAE1F"/><rect x="78.8" y="30" width="2.4" height="10" fill="#4A2135"/><rect x="54" y="38" width="52" height="50" rx="9" fill="#E85C99"/><rect x="63" y="52" width="34" height="18" rx="4" fill="#FFEAF2"/>' },
  { bg: "#E5DFFA", price: "42 €", art: '<ellipse cx="80" cy="91" rx="30" ry="4.5" fill="#C3B9EC"/><g fill="#2FA46B"><ellipse cx="64" cy="34" rx="9" ry="19" transform="rotate(-30 64 34)"/><ellipse cx="96" cy="34" rx="9" ry="19" transform="rotate(30 96 34)"/></g><ellipse cx="80" cy="27" rx="8.5" ry="20" fill="#3DBB7E"/><path d="M58 56h44l-6 32H64z" fill="#7B5BF7"/><rect x="54" y="50" width="52" height="10" rx="4" fill="#6142E0"/>' },
];

function calendar() {
  // May 2026 starts on a Friday (weeks run Monday to Sunday).
  const cells = [];
  for (let i = 0; i < 4; i++) cells.push('<span class="off"></span>');
  for (let day = 1; day <= 31; day++) {
    const weekend = (4 + day - 1) % 7 >= 5;
    const cls = day === 14 ? "sel" : weekend || day < 6 ? "off" : "";
    cells.push(`<span class="${cls}">${day === 14 ? `<b>${day}</b>` : day}</span>`);
  }
  return `<div class="cal">
    <div class="hd"><span>Toukokuu 2026</span><span class="arrows">${icon(ICONS.chevronL, 14, 2.4)}${icon(ICONS.chevronR, 14, 2.4)}</span></div>
    <div class="wk">${["Ma", "Ti", "Ke", "To", "Pe", "La", "Su"].map((d) => `<span>${d}</span>`).join("")}</div>
    <div class="grid">${cells.join("")}</div>
    <div class="slots"><span>9.00</span><span class="on">10.30</span><span>13.15</span><span>15.00</span></div>
  </div>`;
}

function blueprint() {
  const W = CARD_W;
  const H = CARD_H - 28;
  const cx = W / 2;
  const cy = 176;
  const gold = "#E3B341";
  let minor = "";
  let major = "";
  for (let x = cx % 14.5; x < W; x += 14.5) minor += `M${x.toFixed(1)} 0V${H}`;
  for (let y = cy % 14.5; y < H; y += 14.5) minor += `M0 ${y.toFixed(1)}H${W}`;
  for (let x = cx % 58; x <= W; x += 58) major += `M${x.toFixed(1)} 0V${H}`;
  for (let y = cy % 58; y <= H; y += 58) major += `M0 ${y.toFixed(1)}H${W}`;
  const inset = 26;
  const crop = [[inset, inset, -1, -1], [W - inset, inset, 1, -1], [inset, H - inset, -1, 1], [W - inset, H - inset, 1, 1]]
    .map(([x, y, sx, sy]) => `M${x + sx * 6} ${y}h${sx * 13}M${x} ${y + sy * 6}v${sy * 13}`)
    .join("");
  const size = 188; // the chevron gem, drawn on its 24 grid
  const k = size / 24;
  const reg = (x, y) => `<circle cx="${x}" cy="${y}" r="4.6"/><path d="M${x - 8} ${y}h16M${x} ${y - 8}v16"/>`;
  return `<svg class="bp" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    <defs><radialGradient id="bpglow" cx="50%" cy="${((cy / H) * 100).toFixed(1)}%" r="62%"><stop offset="0" stop-color="${gold}" stop-opacity=".13"/><stop offset=".55" stop-color="${gold}" stop-opacity=".03"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient></defs>
    <rect width="${W}" height="${H}" fill="#0A0A0B"/>
    <rect width="${W}" height="${H}" fill="url(#bpglow)"/>
    <path d="${minor}" stroke="${gold}" stroke-opacity=".1" stroke-width=".8" fill="none"/>
    <path d="${major}" stroke="${gold}" stroke-opacity=".24" stroke-width=".9" fill="none"/>
    <rect x="${inset}" y="${inset}" width="${W - 2 * inset}" height="${H - 2 * inset}" fill="none" stroke="${gold}" stroke-opacity=".45" stroke-width=".9" stroke-dasharray="2.5 4"/>
    <path d="${crop}" stroke="${gold}" stroke-width="1.6" fill="none" stroke-linecap="square"/>
    <g fill="none" stroke="${gold}" stroke-width="1" stroke-opacity=".8">${reg(cx, inset)}${reg(cx, H - inset)}</g>
    <g fill="none" stroke="${gold}" stroke-opacity=".55" stroke-width=".9">
      <circle cx="${cx}" cy="${cy}" r="128" stroke-dasharray="3 5"/>
      <path d="M${cx - 176} ${cy}h352M${cx} ${cy - 138}v276" stroke-dasharray="14 4 2 4"/>
      <path d="M${cx - 112} ${cy - 112}l224 224M${cx + 112} ${cy - 112}l-224 224" stroke-opacity=".5"/>
    </g>
    <circle cx="${cx}" cy="${cy}" r="112" fill="#0A0A0B" opacity=".8"/>
    <circle cx="${cx}" cy="${cy}" r="112" fill="none" stroke="${gold}" stroke-opacity=".3" stroke-width=".9"/>
    <g transform="translate(${cx - size / 2} ${cy - size / 2}) scale(${k})" fill="none" stroke="${gold}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10.6 4.4 3 12l7.6 7.6"/><path d="M13.4 4.4 21 12l-7.6 7.6"/>
    </g>
    <g stroke="${gold}" stroke-width="1" fill="none" stroke-opacity=".85">
      <path d="M${cx - 70} ${cy + 143}h140M${cx - 70} ${cy + 138}v10M${cx + 70} ${cy + 138}v10"/>
    </g>
    <g font-family="'Geist Mono',monospace" font-weight="500" fill="${gold}" letter-spacing=".18em">
      <text x="${cx + 1.4}" y="${cy + 172}" font-size="15.5" text-anchor="middle">SINUN IDEASI</text>
      <g font-size="8.5" fill-opacity=".72">
        <text x="${inset + 10}" y="${inset + 18}">MITTATILAUS</text>
        <text x="${W - inset - 10}" y="${inset + 18}" text-anchor="end">MALLI 08</text>
        <text x="${inset + 10}" y="${H - inset - 11}">LUONNOS</text>
        <text x="${W - inset - 10}" y="${H - inset - 11}" text-anchor="end">1 : 1</text>
      </g>
    </g>
  </svg>`;
}

/** Abstract person for the firm's cards. */
const person = (bg, fg) =>
  `<svg class="avatar" viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="${bg}"/><circle cx="24" cy="19" r="8" fill="${fg}"/><path d="M8 44a16 16 0 0 1 32 0v4H8z" fill="${fg}"/></svg>`;

const MOCKS = {
  kipina: {
    tilt: -3,
    html: `
      <div class="hero">
        <div class="nav"><span class="logo">${icon(ICONS.spark, 19, 0, 'style="fill:#FFD166;stroke:none"')}Kipinä</span><span class="links"><span>Palvelut</span><span>Minusta</span><span>Yhteys</span></span></div>
        <h1>Hei, olen<br>yrittäjä.</h1>
        <p class="lead">Teen työni huolella ja ajallaan.</p>
        <span class="btn">Ota yhteyttä<i>${icon(ICONS.arrow, 15, 2.4)}</i></span>
        <div class="portrait"><i class="head"></i><i class="body"></i></div>
        ${icon(ICONS.spark, 26, 0, 'class="s1"')}${icon(ICONS.spark, 15, 0, 'class="s2"')}
      </div>
      <div class="row" style="top:278px"><i class="ic">${icon(ICONS.spark, 15, 0)}</i><b>Mitä teen</b><span class="ln" style="width:170px"></span><em>${icon(ICONS.arrow, 14, 2.2)}</em></div>
      <div class="row" style="top:337px"><i class="ic">${icon(ICONS.spark, 15, 0)}</i><b>Hinnat</b><span class="ln" style="width:120px"></span><em>${icon(ICONS.arrow, 14, 2.2)}</em></div>
      <div class="row" style="top:396px"><i class="ic"></i></div>`,
  },
  paja: {
    tilt: 2.5,
    html: `
      <div class="nav"><span class="logo"><i></i>PAJA</span><span class="links"><span>Palvelut</span><span>Työnäytteet</span><span>Yhteys</span></span><span class="tel">${icon(ICONS.phone, 13, 2.1)}Soita</span></div>
      <div class="hero">
        <div class="stripes"></div>
        <h1>Remontit<br>avaimet käteen</h1>
        <span class="cta">${icon(ICONS.phone, 17, 2)}Soita meille</span>
        <span class="more">Katso työt</span>
      </div>
      <div class="svc" style="top:242px"><i>${icon(ICONS.hammer, 18, 2)}</i><b>Keittiöremontit</b><span>Suunnittelusta asennukseen</span><em>${icon(ICONS.arrow, 15, 2.2)}</em></div>
      <div class="svc" style="top:296px"><i>${icon(ICONS.drop, 18, 2)}</i><b>Kylpyhuoneet</b><span>Vesieristys ja laatoitus</span><em>${icon(ICONS.arrow, 15, 2.2)}</em></div>
      <div class="svc" style="top:350px"><i>${icon(ICONS.roller, 18, 2)}</i><b>Pintaremontit</b><span>Maalaus, tapetit ja lattiat</span><em>${icon(ICONS.arrow, 15, 2.2)}</em></div>`,
  },
  kattaus: {
    tilt: -2,
    html: `
      <div class="left">
        <span class="brand">Kattaus</span>
        ${dishSvg()}
        <i class="ramekin"></i>
        <span class="hours">Avoinna ti–su</span>
      </div>
      <div class="right">
        <div class="nav"><span>Menu</span><span>Tarina</span><span>Yhteys</span><span class="book">Varaa pöytä</span></div>
        <h1>Kattaus</h1>
        <span class="eyebrow">PÄIVÄN LISTA</span>
        <div class="menu">
          <div class="item"><span>Lohikeitto</span><i></i><b>12,50</b></div>
          <div class="item"><span>Paahdettu siika</span><i></i><b>24,00</b></div>
          <div class="item"><span>Sienirisotto</span><i></i><b>19,00</b></div>
          <div class="item"><span>Mustikkapiirakka</span><i></i><b>8,50</b></div>
        </div>
        <span class="all">Koko ruokalista ${icon(ICONS.arrow, 14, 2.2)}</span>
      </div>`,
  },
  galleria: {
    tilt: 3,
    html: `
      <div class="nav"><span class="logo"><i></i>PORTFOLIO</span><span class="links"><span>Työt</span><span>Tietoa</span><span>Yhteys</span></span></div>
      <div class="tile a"><i class="sun"></i><i class="hill"></i><i class="hill h2"></i></div>
      <div class="tile b"><i></i><i></i><i></i></div>
      <div class="tile c"><i></i>${icon(ICONS.arrowUp, 20, 2.2)}</div>
      <div class="tile d"><i class="dune"></i><i class="dune d2"></i><i class="dune d3"></i></div>
      <div class="tile e"><i class="disc"></i><i class="arc"></i></div>
      <h1>Galleria</h1>
      <div class="cap"><span>VALOKUVIA · MUOTOILUA</span><span>01 / 12</span></div>`,
  },
  vastaanotto: {
    tilt: -2.5,
    html: `
      <i class="blob"></i><i class="blob b2"></i>
      <div class="nav"><span class="logo"><i>${icon(ICONS.plus, 15, 3.2)}</i>Vastaanotto</span><span class="links"><span>Palvelut</span><span>Hinnasto</span></span></div>
      <span class="tag"><i></i>Vapaita aikoja tänään</span>
      <h1>Hyvä olo<br>alkaa <em>tästä.</em></h1>
      <p class="lead">Fysioterapiaa, hierontaa ja aikaa palautua.</p>
      <span class="btn">Varaa aika</span>
      <span class="sec">Palvelut ${icon(ICONS.arrow, 13, 2.3)}</span>
      <div class="trust"><i></i><i></i><i></i><span>4,9 / 5 · asiakkaiden arvio</span></div>
      <div class="panel">
        ${calendar()}
        <div class="confirm"><i>${icon(ICONS.check, 14, 3)}</i><span>To 14.5. klo 10.30</span><b>Vahvista</b></div>
      </div>`,
  },
  toimisto: {
    tilt: 1.5,
    html: `
      <div class="hero">
        <div class="arches"><i></i><i></i><i></i></div>
        <div class="nav"><span class="brand"><i></i>Toimisto</span><span class="links"><span>Palvelut</span><span>Asiantuntijat</span><span>Artikkelit</span></span><span class="cta">Ota yhteyttä</span></div>
        <span class="eyebrow">TILIT · LAKI · NEUVONTA</span>
        <h1>Toimisto</h1>
        <p class="lead">Asiantuntemusta, johon voi luottaa.</p>
      </div>
      <div class="cards">
        <div class="pc">${person("#12213F", "#F6F1E6")}<b>Kirjanpito</b><i></i><i class="short"></i><span>Lue lisää ${icon(ICONS.arrow, 12, 2.2)}</span></div>
        <div class="pc">${person("#C8A45A", "#FFF9EC")}<b>Juridiikka</b><i></i><i class="short"></i><span>Lue lisää ${icon(ICONS.arrow, 12, 2.2)}</span></div>
        <div class="pc">${person("#8496B8", "#F6F1E6")}<b>Neuvonta</b><i></i><i class="short"></i><span>Lue lisää ${icon(ICONS.arrow, 12, 2.2)}</span></div>
      </div>`,
  },
  kauppa: {
    tilt: -1.5,
    html: `
      <div class="nav"><span class="brand"><i></i>Kauppa</span><span class="search">${icon(ICONS.search, 13, 2.2)}Etsi tuotteita</span><span class="cart">${icon(ICONS.cart, 19, 1.9)}<b>3</b></span></div>
      <div class="bar"><b>Uutuudet</b><span class="on">Kaikki</span><span>Koti</span><span>Asusteet</span><span>Lahjat</span></div>
      <div class="grid">${PRODUCTS.map((p) => `<div class="prod"><div class="img" style="background:${p.bg}"><svg viewBox="0 0 160 100">${p.art}</svg></div><span class="price">${p.price}</span><span class="add">${icon(ICONS.plus, 14, 2.8)}</span></div>`).join("")}</div>`,
  },
  mittatilaus: {
    tilt: 2,
    html: blueprint(),
  },
};

const MOCK_CSS = `
/* 1 — Kipinä: coral hero on off-white */
.m-kipina{--ch-bg:#FBEEE1;--ch-line:#F1DFCE;--ch-dot:#EBC7B1;--ch-pill:#F4E1D1;--side:#CDB79F}
.m-kipina .page{background:#FFF8F0;color:#2B1712;font-family:"Bricolage Grotesque","Geist",sans-serif}
.m-kipina .hero{position:absolute;left:12px;top:10px;width:556px;height:258px;border-radius:24px;background:#FF6B4A;overflow:hidden}
.m-kipina .hero::before{content:"";position:absolute;right:-84px;top:-70px;width:340px;height:340px;border-radius:50%;background:#FF8061}
.m-kipina .nav{position:absolute;left:24px;right:26px;top:15px;display:flex;justify-content:space-between;align-items:center;color:#FFF8F0}
.m-kipina .logo{display:flex;align-items:center;gap:5px;font-weight:800;font-size:22px;letter-spacing:-.025em}
.m-kipina .links{display:flex;gap:17px;font:500 12.5px "Geist";opacity:.92}
.m-kipina h1{position:absolute;left:23px;top:53px;margin:0;font-weight:800;font-size:61px;line-height:.93;letter-spacing:-.04em;color:#FFF8F0}
.m-kipina .lead{position:absolute;left:25px;top:174px;margin:0;font:500 13.5px "Geist";color:#FFE7DC}
.m-kipina .btn{position:absolute;left:24px;top:203px;height:41px;padding:0 8px 0 21px;border-radius:21px;background:#2B1712;color:#FFF8F0;font:600 17.5px "Geist";letter-spacing:-.01em;display:flex;align-items:center;gap:13px}
.m-kipina .btn i{width:27px;height:27px;border-radius:50%;background:#FF6B4A;color:#2B1712;display:grid;place-items:center}
.m-kipina .portrait{position:absolute;right:34px;top:66px;width:150px;height:150px;border-radius:50%;background:#FFC857;overflow:hidden;box-shadow:0 0 0 6px #FFF8F0}
.m-kipina .portrait .head{position:absolute;left:50%;top:31px;width:52px;height:52px;margin-left:-26px;border-radius:50%;background:#FFF8F0}
.m-kipina .portrait .body{position:absolute;left:50%;top:92px;width:124px;height:124px;margin-left:-62px;border-radius:50%;background:#2B1712}
.m-kipina .s1,.m-kipina .s2{position:absolute;fill:#FFF8F0;stroke:none}
.m-kipina .s1{right:186px;top:60px}
.m-kipina .s2{right:22px;top:206px;fill:#FFD166}
.m-kipina .row{position:absolute;left:12px;width:556px;height:50px;box-sizing:border-box;border-radius:17px;background:#fff;border:1px solid #F3E4D6;display:flex;align-items:center;padding:0 13px;gap:12px}
.m-kipina .row .ic{flex:none;width:30px;height:30px;border-radius:50%;background:#FFE5DC;color:#FF6B4A;display:grid;place-items:center}
.m-kipina .row .ic svg{fill:#FF6B4A;stroke:none}
.m-kipina .row b{font-weight:700;font-size:16.5px;letter-spacing:-.02em;min-width:92px}
.m-kipina .row .ln{height:7px;border-radius:4px;background:#F3E7DB}
.m-kipina .row em{margin-left:auto;width:28px;height:28px;border-radius:50%;border:1.5px solid #EAD8C8;display:grid;place-items:center;color:#2B1712}

/* 2 — Paja: charcoal and safety yellow */
.m-paja{--ch-bg:#2B2D31;--ch-line:#111214;--ch-dot:#4D5056;--ch-pill:#1D1E21;--side:#08080A;--line:rgba(255,255,255,.2)}
.m-paja .page{background:#1A1B1E;color:#F4F4F1}
.m-paja .nav{position:absolute;left:16px;right:16px;top:0;height:47px;display:flex;align-items:center}
.m-paja .logo{display:flex;align-items:center;gap:8px;font:700 24px "Barlow Condensed";letter-spacing:.09em}
.m-paja .logo i{width:21px;height:21px;border-radius:4px;background:#FFC531 linear-gradient(135deg,transparent 0 38%,#17181A 38% 62%,transparent 62%)}
.m-paja .links{margin-left:24px;display:flex;gap:16px;font:500 12.5px "Geist";color:#A9ABB1}
.m-paja .tel{margin-left:auto;height:26px;box-sizing:border-box;padding:0 12px 0 9px;border:1.5px solid #FFC531;border-radius:13px;color:#FFC531;font:600 12.5px "Geist";display:flex;gap:6px;align-items:center}
.m-paja .hero{position:absolute;left:14px;top:47px;width:552px;height:186px;border-radius:10px;background:#FFC531;overflow:hidden;color:#17181A}
.m-paja .hero h1{position:absolute;left:22px;top:17px;margin:0;font:700 62px/.9 "Barlow Condensed";text-transform:uppercase;letter-spacing:-.005em}
.m-paja .cta{position:absolute;left:22px;bottom:17px;height:39px;border-radius:20px;background:#17181A;color:#FFC531;padding:0 19px 0 14px;display:flex;align-items:center;gap:8px;font:600 16.5px "Geist"}
.m-paja .more{position:absolute;left:196px;bottom:27px;font:600 13.5px "Geist";border-bottom:1.5px solid #17181A;padding-bottom:1px}
.m-paja .stripes{position:absolute;right:0;top:0;bottom:0;width:132px;background:repeating-linear-gradient(-45deg,#17181A 0 19px,transparent 19px 38px);clip-path:polygon(34% 0,100% 0,100% 100%,0 100%)}
.m-paja .svc{position:absolute;left:14px;width:552px;height:46px;box-sizing:border-box;border-radius:9px;background:#232529;border:1px solid #33363B;display:flex;align-items:center;padding:0 13px 0 8px;gap:12px}
.m-paja .svc i{flex:none;width:30px;height:30px;border-radius:7px;background:#FFC531;color:#17181A;display:grid;place-items:center}
.m-paja .svc b{font:600 16.5px "Geist";letter-spacing:-.01em;min-width:150px}
.m-paja .svc span{font:400 12.5px "Geist";color:#9C9EA4}
.m-paja .svc em{margin-left:auto;color:#FFC531;display:grid}

/* 3 — Kattaus: forest green, cream, terracotta */
.m-kattaus{--ch-bg:#EFE4CC;--ch-line:#DCCDB0;--ch-dot:#CBBB98;--ch-pill:#E2D5B9;--side:#B3A382}
.m-kattaus .page{background:#F5EDDA;color:#1F3D2B}
.m-kattaus .left{position:absolute;left:0;top:0;bottom:0;width:250px;background:#1F3D2B;overflow:hidden}
.m-kattaus .left::before{content:"";position:absolute;inset:0;background:radial-gradient(90% 70% at 30% 30%,#2B5239,transparent 70%)}
.m-kattaus .brand{position:absolute;left:20px;top:12px;font:italic 400 24px "Instrument Serif";color:#F5EDDA}
.m-kattaus .dish{position:absolute;left:18px;top:74px;width:216px;height:216px}
.m-kattaus .ramekin{position:absolute;left:176px;top:300px;width:86px;height:86px;border-radius:50%;background:radial-gradient(circle at 40% 36%,#86B36B 0 44%,#5E8F4A 45% 52%,#F5EDDA 53% 100%);box-shadow:5px 7px 0 rgba(15,36,24,.5)}
.m-kattaus .hours{position:absolute;left:21px;bottom:17px;font:500 9.5px "Geist Mono";letter-spacing:.18em;text-transform:uppercase;color:#F5EDDA;opacity:.78}
.m-kattaus .right{position:absolute;left:250px;top:0;right:0;bottom:0}
.m-kattaus .right .nav{position:absolute;left:24px;right:16px;top:11px;display:flex;align-items:center;gap:15px;font:500 12.5px "Geist";color:#40604D}
.m-kattaus .book{margin-left:auto;height:27px;border-radius:14px;padding:0 13px;background:#C8643C;color:#FFF6E8;font:600 12.5px "Geist";display:flex;align-items:center}
.m-kattaus h1{position:absolute;left:20px;top:50px;margin:0;font:italic 400 80px/1 "Instrument Serif";letter-spacing:-.02em}
.m-kattaus .eyebrow{position:absolute;left:24px;top:146px;font:500 10px "Geist Mono";letter-spacing:.18em;color:#B9552F}
.m-kattaus .menu{position:absolute;left:24px;right:20px;top:166px}
.m-kattaus .item{display:flex;align-items:baseline;gap:7px;height:36px;font:400 20px "Instrument Serif"}
.m-kattaus .item i{flex:1;border-bottom:2px dotted #B5A582;transform:translateY(-4px)}
.m-kattaus .item b{font:600 14px "Geist";font-variant-numeric:tabular-nums}
.m-kattaus .all{position:absolute;left:24px;top:330px;height:34px;box-sizing:border-box;padding:0 15px;border:1.5px solid #1F3D2B;border-radius:17px;font:600 13px "Geist";display:flex;align-items:center;gap:7px}

/* 4 — Galleria: black page, painterly mosaic, one violet tile */
.m-galleria{--ch-bg:#1A1A1C;--ch-line:#000;--ch-dot:#3A3A3E;--ch-pill:#0C0C0D;--side:#2C2C2F}
.m-galleria .page{background:#0B0B0C;color:#fff}
.m-galleria .nav{position:absolute;left:16px;right:16px;top:0;height:42px;display:flex;align-items:center;justify-content:space-between}
.m-galleria .logo{display:flex;align-items:center;gap:8px;font:500 10.5px "Geist Mono";letter-spacing:.18em}
.m-galleria .logo i{width:9px;height:9px;border-radius:50%;background:#fff}
.m-galleria .links{display:flex;gap:17px;font:500 12.5px "Geist";color:rgba(255,255,255,.72)}
.m-galleria .tile{position:absolute;border-radius:5px;overflow:hidden}
.m-galleria .tile i{position:absolute;display:block}
.m-galleria .a{left:14px;top:42px;width:200px;height:228px;background:radial-gradient(70% 34% at 24% 30%,rgba(255,120,150,.9),transparent 70%),radial-gradient(60% 30% at 80% 44%,rgba(255,196,120,.85),transparent 72%),linear-gradient(180deg,#F59A6C 0%,#E0607E 34%,#8A3F8F 58%,#2B2A78 100%)}
.m-galleria .a .sun{left:112px;top:52px;width:46px;height:46px;border-radius:50%;background:#FFE9BF;box-shadow:0 0 30px 12px rgba(255,220,170,.5)}
.m-galleria .a .hill{left:-60px;top:150px;width:240px;height:150px;border-radius:50%;background:#1D1B58}
.m-galleria .a .h2{left:60px;top:176px;width:220px;height:130px;background:#12113C}
.m-galleria .b{left:222px;top:42px;width:214px;height:130px;background:linear-gradient(180deg,#CFEDE2 0%,#63C7B5 30%,#168C8A 62%,#0B4A5C 100%)}
.m-galleria .b i{left:-20px;width:260px;height:60px;border-radius:50%}
.m-galleria .b i:nth-child(1){top:38px;background:rgba(255,255,255,.34);filter:blur(7px)}
.m-galleria .b i:nth-child(2){top:74px;background:rgba(9,60,80,.55);filter:blur(9px)}
.m-galleria .b i:nth-child(3){top:104px;left:40px;background:rgba(120,230,210,.4);filter:blur(8px)}
.m-galleria .c{left:444px;top:42px;width:122px;height:130px;background:radial-gradient(90% 90% at 24% 16%,#9A5BFF,#7A2FF5 60%,#6820E0)}
.m-galleria .c i{left:22px;top:40px;width:78px;height:78px;border-radius:50%;border:2px solid rgba(255,255,255,.5)}
.m-galleria .c svg{position:absolute;right:11px;top:11px;color:#fff}
.m-galleria .d{left:222px;top:180px;width:150px;height:90px;background:linear-gradient(176deg,#F6EEDF 0%,#E9D9BC 46%,#C9AE84 100%)}
.m-galleria .d .dune{left:-30px;top:34px;width:150px;height:74px;border-radius:50%;background:#B08E62;filter:blur(7px)}
.m-galleria .d .d2{left:48px;top:46px;width:170px;height:80px;background:#F3E4C8;filter:blur(6px)}
.m-galleria .d .d3{left:84px;top:66px;width:120px;height:60px;background:#8F7250;filter:blur(8px)}
.m-galleria .e{left:380px;top:180px;width:186px;height:215px;background:radial-gradient(70% 50% at 70% 16%,rgba(255,214,120,.95),transparent 70%),linear-gradient(165deg,#F4B24A 0%,#E4572E 52%,#7B1D2E 100%)}
.m-galleria .e .disc{left:40px;top:44px;width:104px;height:104px;border-radius:50%;background:linear-gradient(160deg,#FFE3B0,#F28B50);filter:blur(1.2px)}
.m-galleria .e .arc{left:10px;top:122px;width:166px;height:170px;border-radius:83px 83px 0 0;background:linear-gradient(180deg,#5C1426,#3A0C1A);filter:blur(1.2px)}
.m-galleria h1{position:absolute;left:11px;top:279px;margin:0;font:500 80px/1 "Geist";letter-spacing:-.055em}
.m-galleria .cap{position:absolute;left:16px;width:354px;top:372px;display:flex;justify-content:space-between;font:500 9.5px "Geist Mono";letter-spacing:.18em;color:rgba(255,255,255,.62)}

/* 5 — Vastaanotto: white and teal, booking calendar */
.m-vastaanotto{--ch-bg:#F0F7F5;--ch-line:#DCEBE6;--ch-dot:#BFD9D2;--ch-pill:#E1EEEB;--side:#A9C3BC}
.m-vastaanotto .page{background:#fff;color:#0C2F2B}
.m-vastaanotto .blob{position:absolute;left:-74px;bottom:-96px;width:250px;height:250px;border-radius:50%;background:#E4F6F1}
.m-vastaanotto .b2{left:196px;bottom:auto;top:52px;width:54px;height:54px;background:#EEF9F6}
.m-vastaanotto .nav{position:absolute;left:20px;top:0;height:46px;display:flex;align-items:center}
.m-vastaanotto .logo{display:flex;align-items:center;gap:8px;font:600 17.5px "Geist";letter-spacing:-.03em}
.m-vastaanotto .logo i{width:23px;height:23px;border-radius:8px;background:#0E9F8E;color:#fff;display:grid;place-items:center}
.m-vastaanotto .links{margin-left:18px;display:flex;gap:13px;font:500 12px "Geist";color:#58736E}
.m-vastaanotto .tag{position:absolute;left:22px;top:66px;height:23px;padding:0 11px 0 9px;border-radius:12px;background:#E4F6F1;color:#0A7C6F;font:600 10.5px "Geist";display:flex;align-items:center;gap:6px}
.m-vastaanotto .tag i{width:6px;height:6px;border-radius:50%;background:#0E9F8E}
.m-vastaanotto h1{position:absolute;left:21px;top:100px;margin:0;font:600 45px/1 "Geist";letter-spacing:-.045em}
.m-vastaanotto h1 em{font-style:normal;color:#0E9F8E}
.m-vastaanotto .lead{position:absolute;left:23px;top:199px;width:240px;margin:0;font:400 13px/1.35 "Geist";color:#58736E}
.m-vastaanotto .btn{position:absolute;left:22px;top:247px;height:46px;padding:0 24px;border-radius:23px;background:#0E9F8E;color:#fff;font:600 18.5px "Geist";letter-spacing:-.01em;display:flex;align-items:center;box-shadow:0 10px 18px -8px rgba(14,159,142,.7)}
.m-vastaanotto .sec{position:absolute;left:172px;top:262px;font:600 13px "Geist";display:flex;align-items:center;gap:5px}
.m-vastaanotto .trust{position:absolute;left:22px;top:330px;display:flex;align-items:center;font:500 11.5px "Geist";color:#3F5B56}
.m-vastaanotto .trust i{width:24px;height:24px;border-radius:50%;border:2px solid #fff;margin-right:-8px;background:#8FD3C8}
.m-vastaanotto .trust i:nth-child(2){background:#FFC9A8}
.m-vastaanotto .trust i:nth-child(3){background:#0E9F8E}
.m-vastaanotto .trust span{margin-left:17px}
.m-vastaanotto .panel{position:absolute;left:288px;top:42px;width:278px;height:353px;border-radius:26px;background:#0E9F8E;overflow:hidden}
.m-vastaanotto .panel::before{content:"";position:absolute;right:-70px;top:-70px;width:220px;height:220px;border-radius:50%;background:rgba(255,255,255,.13)}
.m-vastaanotto .panel::after{content:"";position:absolute;left:-50px;bottom:-70px;width:180px;height:180px;border-radius:50%;background:rgba(4,70,62,.22)}
.m-vastaanotto .cal{position:absolute;z-index:1;left:17px;top:17px;width:244px;box-sizing:border-box;border-radius:18px;background:#fff;padding:14px 14px 13px;box-shadow:0 14px 26px -12px rgba(3,58,51,.7)}
.m-vastaanotto .hd{display:flex;justify-content:space-between;align-items:center;font:600 15px "Geist";letter-spacing:-.02em}
.m-vastaanotto .arrows{display:flex;gap:4px;color:#58736E}
.m-vastaanotto .wk,.m-vastaanotto .grid{display:grid;grid-template-columns:repeat(7,1fr);text-align:center}
.m-vastaanotto .wk{margin-top:10px;font:600 9px "Geist";color:#8BA5A0}
.m-vastaanotto .grid{margin-top:3px}
.m-vastaanotto .grid span{height:29px;display:grid;place-items:center;font:500 12px "Geist";font-variant-numeric:tabular-nums}
.m-vastaanotto .grid .off{color:#C2D2CE}
.m-vastaanotto .grid .sel b{width:27px;height:27px;border-radius:50%;background:#0E9F8E;color:#fff;font-weight:700;display:grid;place-items:center;box-shadow:0 4px 8px -2px rgba(14,159,142,.7)}
.m-vastaanotto .slots{display:flex;gap:5px;margin-top:9px}
.m-vastaanotto .slots span{flex:1;height:25px;box-sizing:border-box;border-radius:13px;border:1px solid #D4E5E1;font:600 10.5px "Geist";display:grid;place-items:center;color:#3F5B56}
.m-vastaanotto .slots .on{background:#0E9F8E;border-color:#0E9F8E;color:#fff}
.m-vastaanotto .confirm{position:absolute;z-index:1;left:17px;right:17px;bottom:17px;height:44px;box-sizing:border-box;border-radius:15px;background:rgba(255,255,255,.17);color:#fff;display:flex;align-items:center;padding:0 8px 0 11px;gap:8px;font:500 12.5px "Geist"}
.m-vastaanotto .confirm i{width:22px;height:22px;border-radius:50%;background:#fff;color:#0E9F8E;display:grid;place-items:center}
.m-vastaanotto .confirm b{margin-left:auto;height:29px;padding:0 12px;border-radius:10px;background:#fff;color:#0A7C6F;font:600 12px "Geist";display:flex;align-items:center}

/* 6 — Toimisto: navy hero, ivory body */
.m-toimisto{--ch-bg:#0D1830;--ch-line:#070E1E;--ch-dot:#2B3B62;--ch-pill:#18284C;--side:#070D1C}
.m-toimisto .page{background:#F6F1E6;color:#12213F}
.m-toimisto .hero{position:absolute;left:0;top:0;right:0;height:236px;background:#12213F;overflow:hidden;color:#F6F1E6}
.m-toimisto .nav{position:absolute;left:20px;right:16px;top:0;height:46px;display:flex;align-items:center}
.m-toimisto .brand{display:flex;align-items:center;gap:8px;font:400 23px "Instrument Serif"}
.m-toimisto .brand i{width:8px;height:8px;transform:rotate(45deg);background:#C8A45A}
.m-toimisto .links{margin-left:auto;display:flex;gap:15px;font:500 12px "Geist";color:rgba(246,241,230,.76)}
.m-toimisto .cta{margin-left:16px;height:26px;box-sizing:border-box;padding:0 11px;border:1px solid rgba(246,241,230,.55);border-radius:3px;font:600 11.5px "Geist";display:flex;align-items:center}
.m-toimisto .eyebrow{position:absolute;left:23px;top:64px;font:500 9.5px "Geist Mono";letter-spacing:.18em;color:#D2AF66}
.m-toimisto h1{position:absolute;left:19px;top:74px;margin:0;font:400 92px/1 "Instrument Serif";letter-spacing:-.02em}
.m-toimisto .lead{position:absolute;left:23px;top:170px;margin:0;font:400 14px "Geist";color:rgba(246,241,230,.8)}
.m-toimisto .arches{position:absolute;right:22px;top:54px;bottom:0;width:176px}
.m-toimisto .arches i{position:absolute;bottom:0;width:52px;border-radius:26px 26px 0 0;background:linear-gradient(180deg,#263E77,#1A2D5A)}
.m-toimisto .arches i:nth-child(1){left:0;height:112px}
.m-toimisto .arches i:nth-child(2){left:62px;height:160px;background:none;box-shadow:inset 0 0 0 1.5px #C8A45A}
.m-toimisto .arches i:nth-child(3){left:124px;height:134px}
.m-toimisto .cards{position:absolute;left:16px;top:206px;width:548px;display:flex;gap:13px}
.m-toimisto .pc{position:relative;flex:1;height:184px;box-sizing:border-box;border-radius:7px;background:#FFFDF8;border:1px solid #E2D9C6;padding:15px 15px 0;box-shadow:0 10px 18px -12px rgba(18,33,63,.45)}
.m-toimisto .avatar{display:block;width:46px;height:46px;border-radius:50%}
.m-toimisto .pc b{display:block;margin-top:11px;font:400 23px/1.1 "Instrument Serif"}
.m-toimisto .pc i{display:block;height:6px;border-radius:3px;background:#EAE2D2;margin-top:10px}
.m-toimisto .pc .short{width:62%;margin-top:7px}
.m-toimisto .pc span{position:absolute;left:15px;bottom:14px;font:600 11.5px "Geist";color:#8A6A24;display:flex;align-items:center;gap:4px}

/* 7 — Kauppa: lilac page, product grid, indigo accent */
.m-kauppa{--ch-bg:#E5E0FB;--ch-line:#D6CFF4;--ch-dot:#BFB6EC;--ch-pill:#D8D1F7;--side:#ACA3D6}
.m-kauppa .page{background:#EFEBFF;color:#1C1A3A}
.m-kauppa .nav{position:absolute;left:16px;right:15px;top:0;height:48px;display:flex;align-items:center}
.m-kauppa .brand{display:flex;align-items:center;gap:7px;font:700 21px "Geist";letter-spacing:-.04em}
.m-kauppa .brand i{width:19px;height:19px;border-radius:6px;background:#5B5BF0;box-shadow:inset 0 0 0 5px #5B5BF0,inset 0 0 0 9px #fff}
.m-kauppa .search{margin-left:18px;width:214px;height:27px;box-sizing:border-box;border-radius:14px;background:#fff;display:flex;align-items:center;gap:6px;padding:0 10px;font:400 11.5px "Geist";color:#8A87A8}
.m-kauppa .cart{margin-left:auto;position:relative;width:35px;height:35px;border-radius:50%;background:#fff;display:grid;place-items:center}
.m-kauppa .cart b{position:absolute;right:-5px;top:-4px;width:18px;height:18px;border-radius:50%;background:#5B5BF0;color:#fff;font:700 10.5px "Geist";display:grid;place-items:center;box-shadow:0 0 0 2px #EFEBFF}
.m-kauppa .bar{position:absolute;left:16px;right:14px;top:50px;height:24px;display:flex;align-items:center;gap:6px}
.m-kauppa .bar b{font:700 16px "Geist";letter-spacing:-.03em;margin-right:8px}
.m-kauppa .bar span{height:22px;padding:0 11px;border-radius:11px;background:#fff;font:600 10.5px "Geist";display:flex;align-items:center;color:#4B4872}
.m-kauppa .bar .on{background:#5B5BF0;color:#fff}
.m-kauppa .grid{position:absolute;left:14px;top:83px;width:552px;display:grid;grid-template-columns:repeat(3,1fr);gap:9px}
.m-kauppa .prod{position:relative;height:153px;box-sizing:border-box;border-radius:14px;background:#fff;padding:6px;box-shadow:0 6px 12px -8px rgba(60,50,140,.4)}
.m-kauppa .img{height:106px;border-radius:10px;overflow:hidden}
.m-kauppa .img svg{display:block;width:100%;height:100%}
.m-kauppa .price{position:absolute;left:9px;bottom:8px;height:25px;padding:0 11px;border-radius:13px;background:#ECEBFF;color:#3F3FD6;font:700 14.5px "Geist";letter-spacing:-.01em;display:flex;align-items:center}
.m-kauppa .add{position:absolute;right:9px;bottom:8px;width:25px;height:25px;border-radius:50%;background:#5B5BF0;color:#fff;display:grid;place-items:center}

/* 8 — Mittatilaus: gold blueprint on black */
.m-mittatilaus{--ch-bg:#0E0E0F;--ch-line:rgba(227,179,65,.34);--ch-dot:transparent;--ch-pill:transparent;--side:#000;--line:rgba(227,179,65,.8);--line-w:1.5px}
.m-mittatilaus .chrome i{box-shadow:inset 0 0 0 1.2px rgba(227,179,65,.8)}
.m-mittatilaus .chrome .url{box-shadow:inset 0 0 0 1px rgba(227,179,65,.4)}
.m-mittatilaus .chrome .url b{background:rgba(227,179,65,.7)}
.m-mittatilaus .page{background:#0A0A0B}
.m-mittatilaus .bp{display:block}
`;

function documentFor(id) {
  const glaze = GLAZES[id];
  const mock = MOCKS[id];
  const D = 2 * (R + BLEED);
  const lift = glaze.dark ? [0.5, 0.5, 0.45] : [0.26, 0.2, 0.13];
  return `<!doctype html>
<html lang="fi">
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONT_URL}">
<style>
*{box-sizing:content-box}
html,body{margin:0;background:transparent}
body{width:${SIZE}px;height:${SIZE}px;position:relative;overflow:hidden;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision;font-family:"Geist",sans-serif;font-synthesis:none}
.plate{position:absolute;left:${px(SIZE / 2 - R - BLEED)};top:${px(SIZE / 2 - R - BLEED)};width:${px(D)};height:${px(D)};border-radius:50%;overflow:hidden;isolation:isolate}
.p-layer{position:absolute;inset:0;width:100%;height:100%;border-radius:50%}
.p-well{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);border-radius:50%}
.card{position:absolute;left:50%;top:50%;width:${CARD_W}px;height:${CARD_H}px;margin:${-CARD_H / 2}px 0 0 ${-CARD_W / 2}px;border-radius:15px;transform:rotate(${mock.tilt}deg);
  box-shadow:2.5px 3.5px 0 0 var(--side),3px 6px 6px rgba(0,0,0,${lift[0]}),9px 15px 22px rgba(0,0,0,${lift[1]}),20px 30px 46px rgba(0,0,0,${lift[2]})}
.card-in{position:absolute;inset:0;border-radius:15px;overflow:hidden;background:var(--ch-bg)}
.card::after{content:"";position:absolute;inset:0;border-radius:15px;box-shadow:inset 0 0 0 var(--line-w,1px) var(--line,rgba(0,0,0,.1)),inset 1px 1.5px 0 0 rgba(255,255,255,.28);pointer-events:none}
.chrome{position:absolute;left:0;right:0;top:0;height:27px;display:flex;align-items:center;gap:6px;padding:0 13px;background:var(--ch-bg);border-bottom:1px solid var(--ch-line)}
.chrome i{width:8px;height:8px;border-radius:50%;background:var(--ch-dot)}
.chrome .url{position:absolute;left:50%;top:50%;width:216px;height:14px;margin:-7px 0 0 -108px;border-radius:7px;background:var(--ch-pill)}
.chrome .url b{position:absolute;left:8px;top:4px;width:6px;height:6px;border-radius:2px;background:var(--ch-dot)}
.page{position:absolute;left:0;right:0;top:28px;bottom:0;overflow:hidden}
.page svg{flex:none}
${MOCK_CSS}
</style>
</head>
<body>
<div class="plate">
${plate(glaze)}
<div class="card m-${id}"><div class="card-in">${chrome}<div class="page">${mock.html}</div></div></div>
</div>
</body>
</html>`;
}

/* ------------------------------------------------------------------ render */

async function encode(rgba) {
  let last = null;
  for (const quality of QUALITIES) {
    const buffer = await sharp(rgba, { raw: { width: SIZE, height: SIZE, channels: 4 } })
      .webp({ quality, alphaQuality: 100, effort: 6, smartSubsample: true })
      .toBuffer();
    last = { buffer, quality };
    if (buffer.length <= BUDGET) break;
  }
  return last;
}

async function main() {
  const args = Object.fromEntries(process.argv.slice(2).map((arg) => arg.replace(/^--/, "").split("=")));
  const ids = args.only ? args.only.split(",") : Object.keys(MOCKS);
  for (const id of ids) if (!MOCKS[id] || !GLAZES[id]) throw new Error(`Unknown plate "${id}"`);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  if (args.png) fs.mkdirSync(args.png, { recursive: true });

  // Exact, antialiased circle; everything outside it ends up with alpha 0.
  const mask = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}"><circle cx="${SIZE / 2}" cy="${SIZE / 2}" r="${R}" fill="#fff"/></svg>`))
    .resize(SIZE, SIZE)
    .png()
    .toBuffer();

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: SIZE, height: SIZE }, deviceScaleFactor: SUPERSAMPLE });
  try {
    for (const id of ids) {
      await page.setContent(documentFor(id), { waitUntil: "load" });
      const missing = await page.evaluate(async (faces) => {
        const failed = [];
        for (const face of faces) {
          const loaded = await document.fonts.load(face, "Hyvä yrittäjä 29 €").catch(() => []);
          if (!loaded.length) failed.push(face);
        }
        await document.fonts.ready;
        return failed;
      }, FONT_FACES);
      if (missing.length) throw new Error(`Fonts failed to load (is Google Fonts reachable?): ${missing.join(", ")}`);

      const shot = await page.screenshot({ omitBackground: true, type: "png", clip: { x: 0, y: 0, width: SIZE, height: SIZE } });
      const rgba = await sharp(shot)
        .resize(SIZE, SIZE, { kernel: "lanczos3" })
        .composite([{ input: mask, blend: "dest-in" }])
        .raw()
        .toBuffer();
      // The image doubles as a CSS mask: clear the colour wherever alpha is 0 (also compresses better).
      for (let i = 0; i < rgba.length; i += 4) if (rgba[i + 3] === 0) rgba[i] = rgba[i + 1] = rgba[i + 2] = 0;

      const { buffer, quality } = await encode(rgba);
      fs.writeFileSync(path.join(OUT_DIR, `${id}.webp`), buffer);
      if (args.png) await sharp(rgba, { raw: { width: SIZE, height: SIZE, channels: 4 } }).png().toFile(path.join(args.png, `${id}.png`));
      const note = buffer.length > BUDGET ? "  (over the 70 KB budget)" : "";
      console.log(`${`${id}.webp`.padEnd(18)} ${(buffer.length / 1024).toFixed(1).padStart(6)} KB  q${quality}${note}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
