#!/usr/bin/env node
/**
 * Elite Code — navigation covers, social share image and touch icon.
 *
 * Generates, from the HTML/CSS/SVG in this file:
 *   public/nav/{sivumallit,palvelu,prosessi,hinnasto,tarjous}.webp   640 × 480, opaque
 *   app/opengraph-image.png                                          1200 × 630
 *   app/apple-icon.png                                               180 × 180
 * (app/icon.svg and app/opengraph-image.alt.txt are hand-written and not touched.)
 *
 * Run from the project root:
 *   node scripts/art/render-covers.cjs                    everything
 *   node scripts/art/render-covers.cjs --only hinnasto,og one or more of the names above, "og", "apple"
 *   node scripts/art/render-covers.cjs --preview <dir>    also writes lossless PNG previews to <dir>
 *
 * Needs Playwright with Chromium ("npm i -D playwright && npx playwright install chromium")
 * and network access to Google Fonts. sharp is already installed with Next.js.
 * Each picture is drawn at 2× in headless Chromium and scaled down with sharp. Nothing in here
 * is random, so the same Chromium and fonts give the same files on every run.
 */

const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..", "..");

/* ───────────────────────────── brand ───────────────────────────── */

const C = {
  ink: "#0A0A0B",
  white: "#F5F4F0",
  gold: "#E3B341",
  goldInk: "#1A1405",
  /** Gold for type on a light field, where the brand gold is too pale to read. */
  goldDeep: "#B8871C",
  border: "#2A2A2E",
  mute: "#A8A7A0",
};
/** Price tiers 1–5, cool to warm. */
const TIER = ["#8A9BBF", "#3FB8A6", "#9D8CF5", "#F0725C", "#E3B341"];

/** The logo mark on its 24-unit grid. */
const MARK = '<path d="M10.6 4.4 3 12l7.6 7.6"/><path d="M13.4 4.4 21 12l-7.6 7.6"/>';
const mark = (size, color = C.gold) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="${color}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${MARK}</svg>`;

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Geist:wght@600&family=Geist+Mono:wght@500&family=Instrument+Serif:ital@1&display=block";
/** Every face the artwork sets type in. Rendering stops if one of them did not load. */
const FONT_FACES = ['600 40px "Geist"', '500 40px "Geist Mono"', 'italic 400 40px "Instrument Serif"'];

const BASE_CSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body{background:transparent}
  body{font-family:"Geist",sans-serif;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}
  .stage{position:relative;overflow:hidden}
  .abs{position:absolute}
  .mono{font-family:"Geist Mono",monospace;font-weight:500;text-transform:uppercase;letter-spacing:.18em}
  .serif{font-family:"Instrument Serif",serif;font-style:italic;font-weight:400}
  svg{display:block}
`;

function doc(width, height, css, body) {
  return `<!doctype html><html lang="fi"><head><meta charset="utf-8"><link rel="stylesheet" href="${FONT_URL}"><style>${BASE_CSS}${css}</style></head><body><div class="stage" style="width:${width}px;height:${height}px">${body}</div></body></html>`;
}

/* ─────────────────────── the cover series (640 × 480) ───────────────────────
 * One grid for all five: margins of about 46 px, the subject centred, and movement that runs
 * from the lower left to the upper right.
 * One light for all five: a key light from the top left, so every field is brighter there and
 * every object drops a soft shadow down and to the right.
 * One edge for all five: see `edge` below.
 * The fields alternate so that neighbours in the menu never look alike:
 * charcoal, gold, charcoal with dots, warm stone, near-black with a warm glow.
 * The light always lies on the field, under the subject, so nothing white is greyed by the falloff.
 * No field is as dark as the page (#0A0A0B) or as light as the paper (#FAF9F6): each cover has to
 * keep its outline on both.
 */

const W = 640;
const H = 480;

/** Key light and falloff laid over a field. `tone` tints the falloff so shadows stay in the field's hue. */
function light({ glow = 0.1, shade = 0.34, tone = "0,0,0", glowTone = "255,255,255" } = {}) {
  return `
    <div class="abs" style="inset:0;background:radial-gradient(120% 120% at 12% 0%, rgba(${glowTone},${glow}) 0%, rgba(${glowTone},0) 58%)"></div>
    <div class="abs" style="inset:0;background:radial-gradient(110% 110% at 100% 100%, rgba(${tone},${shade}) 0%, rgba(${tone},0) 62%)"></div>`;
}

/**
 * A one-pixel edge (at the 256 px display size) that follows the 8 px corner radius the site gives
 * the picture. It keeps dark covers from melting into the dark page and light ones into the paper.
 */
const edge = (tone, alpha) =>
  `<div class="abs" style="inset:0;border-radius:20px;box-shadow:inset 0 0 0 2.5px rgba(${tone},${alpha})"></div>`;
const EDGE_ON_DARK = edge("255,255,255", 0.13);
const EDGE_ON_LIGHT = edge("10,10,11", 0.12);
/** The stone field is close to the light theme's paper, so its edge is drawn firmer. */
const EDGE_ON_STONE = edge("10,10,11", 0.2);

/* 01 — Sivumallit: plates on the belt, seen from above. */
function coverSivumallit() {
  const R = 83;
  const TILT = -7;
  const plates = [
    { x: 114, y: 127, tier: 1, kind: "hero" },
    { x: 332, y: 127, tier: 3, kind: "gallery" },
    { x: 550, y: 127, tier: 4, kind: "shop" },
    { x: -6, y: 353, tier: 3, kind: "office" },
    { x: 212, y: 353, tier: 2, kind: "menu" },
    { x: 430, y: 353, tier: 5, kind: "bespoke" },
    { x: 648, y: 353, tier: 1, kind: "hero" },
  ];

  /** A tiny website, 104 × 76, drawn in the site's own dark look with the plate's hue as its accent. */
  const mockup = (kind, hue) => {
    const w = C.white;
    const g = "#77767B";
    const d = "#2C2C31";
    const bodies = {
      hero: `
        <rect x="10" y="22" width="40" height="7.5" rx="2" fill="${w}"/>
        <rect x="10" y="33" width="29" height="7.5" rx="2" fill="${w}"/>
        <rect x="10" y="46" width="34" height="3.5" rx="1.75" fill="${g}"/>
        <rect x="10" y="56" width="25" height="10" rx="5" fill="${hue}"/>
        <rect x="59" y="20" width="35" height="46" rx="5" fill="${hue}"/>
        <circle cx="76.5" cy="43" r="9" fill="${C.ink}" opacity=".28"/>`,
      gallery: `
        <rect x="10" y="20" width="26" height="21" rx="3" fill="${hue}"/>
        <rect x="39" y="20" width="26" height="21" rx="3" fill="${d}"/>
        <rect x="68" y="20" width="26" height="21" rx="3" fill="${w}"/>
        <rect x="10" y="45" width="26" height="21" rx="3" fill="${d}"/>
        <rect x="39" y="45" width="26" height="21" rx="3" fill="${w}"/>
        <rect x="68" y="45" width="26" height="21" rx="3" fill="${hue}"/>`,
      shop: [0, 1, 2]
        .map((i) => {
          const x = 10 + i * 29;
          return `
        <rect x="${x}" y="20" width="26" height="46" rx="3.5" fill="#202024"/>
        <rect x="${x + 3.5}" y="23.5" width="19" height="19" rx="2.5" fill="${i === 1 ? hue : w}"/>
        <rect x="${x + 3.5}" y="47" width="15" height="3.5" rx="1.75" fill="${g}"/>
        <rect x="${x + 3.5}" y="54.5" width="12" height="6.5" rx="3.25" fill="${i === 1 ? w : hue}"/>`;
        })
        .join(""),
      menu: `
        <rect x="10" y="20" width="84" height="19" rx="4" fill="${hue}"/>
        ${[0, 1, 2]
          .map(
            (i) => `
        <rect x="10" y="${45.5 + i * 8}" width="${[40, 32, 44][i]}" height="3.6" rx="1.8" fill="${w}"/>
        <rect x="80" y="${45.5 + i * 8}" width="14" height="3.6" rx="1.8" fill="${g}"/>`,
          )
          .join("")}`,
      bespoke: `
        <rect x="10" y="23" width="36" height="7.5" rx="2" fill="${w}"/>
        <rect x="10" y="34" width="27" height="7.5" rx="2" fill="${hue}"/>
        <rect x="10" y="48" width="30" height="3.5" rx="1.75" fill="${g}"/>
        <rect x="10" y="55" width="22" height="3.5" rx="1.75" fill="${g}"/>
        <circle cx="74" cy="43" r="19" fill="none" stroke="${hue}" stroke-width="3"/>
        <path d="M71.5 34.5 63 43l8.5 8.5M76.5 34.5 85 43l-8.5 8.5" fill="none" stroke="${w}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`,
      office: `
        <rect x="10" y="20" width="20" height="46" rx="3.5" fill="${d}"/>
        <rect x="36" y="21" width="44" height="7" rx="2" fill="${w}"/>
        <rect x="36" y="33" width="58" height="3.5" rx="1.75" fill="${g}"/>
        <rect x="36" y="40" width="50" height="3.5" rx="1.75" fill="${g}"/>
        <rect x="36" y="56" width="9" height="10" rx="2" fill="${d}"/>
        <rect x="48" y="50" width="9" height="16" rx="2" fill="${d}"/>
        <rect x="60" y="46" width="9" height="20" rx="2" fill="${hue}"/>`,
    };
    return `
      <g>
        <rect x="2" y="3.5" width="104" height="76" rx="8" fill="#000" opacity=".2" filter="url(#blur3)"/>
        <rect width="104" height="76" rx="8" fill="#141416"/>
        <path d="M0 8a8 8 0 0 1 8-8h88a8 8 0 0 1 8 8v4H0z" fill="#232327"/>
        <circle cx="8" cy="6" r="1.7" fill="#55555B"/><circle cx="13.6" cy="6" r="1.7" fill="#55555B"/><circle cx="19.2" cy="6" r="1.7" fill="#55555B"/>
        ${bodies[kind]}
      </g>`;
  };

  const plate = ({ x, y, tier, kind }) => {
    const hue = TIER[tier - 1];
    return `
      <g transform="translate(${x} ${y})">
        <circle cx="10" cy="17" r="${R}" fill="#000" opacity=".62" filter="url(#blur12)"/>
        <circle r="${R}" fill="${hue}"/>
        <circle r="${R - 3.75}" fill="none" stroke="url(#glaze)" stroke-width="7.5"/>
        <circle r="${R - 7.5}" fill="url(#ceramic)"/>
        <circle r="${R - 18}" fill="url(#well)"/>
        <circle r="${R - 18}" fill="none" stroke="#000" stroke-opacity=".08" stroke-width="1.2"/>
        <g transform="translate(-52 -38)">${mockup(kind, hue)}</g>
      </g>`;
  };

  // Slat seams: shallow crescents across each lane, the two lanes half a slat out of step.
  const seams = (y0, y1, offset) => {
    let out = "";
    for (let x = -160 + offset; x < 820; x += 58) {
      const bow = 7;
      out += `<path d="M${x} ${y0}Q${x + bow} ${(y0 + y1) / 2} ${x} ${y1}" stroke="#000" stroke-opacity=".42" stroke-width="2.2"/>`;
      out += `<path d="M${x + 2.4} ${y0}Q${x + bow + 2.4} ${(y0 + y1) / 2} ${x + 2.4} ${y1}" stroke="#fff" stroke-opacity=".05" stroke-width="1.2"/>`;
    }
    return out;
  };

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      <defs>
        <filter id="blur12" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="11"/></filter>
        <filter id="blur3" x="-20%" y="-20%" width="140%" height="150%"><feGaussianBlur stdDeviation="2.4"/></filter>
        <radialGradient id="ceramic" cx="34%" cy="28%" r="88%">
          <stop offset="0" stop-color="#FFFFFF"/><stop offset=".5" stop-color="${C.white}"/><stop offset="1" stop-color="#DAD6CA"/>
        </radialGradient>
        <radialGradient id="well" cx="62%" cy="68%" r="80%">
          <stop offset="0" stop-color="#FDFCF9"/><stop offset=".7" stop-color="#F0EEE7"/><stop offset="1" stop-color="#E2DFD5"/>
        </radialGradient>
        <linearGradient id="glaze" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#fff" stop-opacity=".34"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/>
          <stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/>
        </linearGradient>
        <radialGradient id="key" cx="14%" cy="0%" r="95%">
          <stop offset="0" stop-color="#fff" stop-opacity=".13"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="fall" cx="100%" cy="100%" r="90%">
          <stop offset="0" stop-color="#000" stop-opacity=".5"/><stop offset=".65" stop-color="#000" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="#222226"/>
      <g transform="rotate(${TILT} 320 240)">
        <g fill="none">${seams(-140, 234, 0)}${seams(246, 620, 29)}</g>
        <rect x="-200" y="233" width="1040" height="14" fill="#0B0B0D"/>
        <rect x="-200" y="247" width="1040" height="1.4" fill="#fff" opacity=".07"/>
      </g>
      <rect width="${W}" height="${H}" fill="url(#key)"/>
      <rect width="${W}" height="${H}" fill="url(#fall)"/>
      <g transform="rotate(${TILT} 320 240)">${plates.map(plate).join("")}</g>
    </svg>`;
  return doc(W, H, "", `${svg}${EDGE_ON_DARK}`);
}

/* 02 — Palvelu: one design on a browser window and a phone, on gold. */
function coverPalvelu() {
  const css = `
    .stage{background:${C.gold}}
    .win,.phone{position:absolute;background:${C.ink};overflow:hidden}
    .win{left:50px;top:70px;width:408px;height:292px;border-radius:14px;box-shadow:16px 26px 36px rgba(96,62,0,.42),3px 5px 8px rgba(96,62,0,.32)}
    .bar{height:30px;background:#19191C;display:flex;align-items:center;gap:6px;padding:0 13px;border-bottom:1px solid ${C.border}}
    .bar i{width:8px;height:8px;border-radius:50%;background:#45454B}
    .bar b{margin-left:74px;width:150px;height:13px;border-radius:7px;background:#2A2A2E}
    .phone{left:430px;top:128px;width:156px;height:306px;border-radius:30px;border:5px solid #26262A;box-shadow:16px 26px 36px rgba(96,62,0,.46),3px 5px 8px rgba(96,62,0,.34)}
    .row{display:flex;align-items:center}
    .l{display:block;border-radius:99px;background:${C.white}}
    .m{background:#5E5E64}
    .g{background:${C.gold}}
    .h{height:14px;border-radius:4px}
    .it{transform:skewX(-14deg)}
    .pill{display:block;height:24px;border-radius:12px}
    .ghost{border:1.6px solid #45454B;background:transparent}
    .pic{position:relative;border-radius:10px;background:#19191C;border:1px solid ${C.border};overflow:hidden}
    .tile{border-radius:8px;background:#19191C;border:1px solid ${C.border};padding:9px 10px}
    .dot{display:block;width:9px;height:9px;border-radius:3px;margin-bottom:7px}
  `;
  // The hero picture inside the design: a plate from the belt.
  const dish = (size) => `
    <svg class="abs" style="left:50%;top:50%;transform:translate(-50%,-50%)" width="${size}" height="${size}" viewBox="-50 -50 100 100">
      <circle r="46" fill="${TIER[2]}"/><circle r="41" fill="${C.white}"/>
      <circle r="30" fill="none" stroke="#000" stroke-opacity=".08" stroke-width="1.4"/>
      <rect x="-21" y="-15" width="42" height="30" rx="4.5" fill="${C.ink}"/>
      <rect x="-15" y="-7" width="18" height="4.4" rx="2.2" fill="${C.white}"/>
      <rect x="-15" y="1.6" width="11" height="4.4" rx="2.2" fill="${C.gold}"/>
    </svg>`;
  const body = `
    ${light({ glow: 0.42, glowTone: "255,240,190", shade: 0.3, tone: "140,90,0" })}
    <div class="win">
      <div class="bar"><i></i><i></i><i></i><b></b></div>
      <div style="padding:16px 22px 0">
        <div class="row" style="gap:8px">
          ${mark(15)}
          <span class="l" style="width:46px;height:5px"></span>
          <span style="flex:1"></span>
          <span class="l m" style="width:26px;height:5px"></span>
          <span class="l m" style="width:26px;height:5px;margin-left:10px"></span>
          <span class="l m" style="width:26px;height:5px;margin-left:10px"></span>
          <span class="pill" style="width:50px;height:18px;margin-left:14px;background:${C.white}"></span>
        </div>
        <div class="row" style="align-items:flex-start;gap:24px;margin-top:21px">
          <div style="flex:1">
            <span class="l h" style="width:184px"></span>
            <span class="l h" style="width:136px;margin-top:7px"></span>
            <span class="l h g it" style="width:160px;margin-top:7px;margin-left:3px"></span>
            <span class="l m" style="width:176px;height:4.5px;margin-top:15px"></span>
            <span class="l m" style="width:150px;height:4.5px;margin-top:6px"></span>
            <div class="row" style="gap:8px;margin-top:15px">
              <span class="pill g" style="width:84px;height:22px"></span>
              <span class="pill ghost" style="width:66px;height:22px"></span>
            </div>
          </div>
          <div class="pic" style="width:146px;height:122px">${dish(96)}</div>
        </div>
        <div class="row" style="gap:10px;margin-top:17px;align-items:stretch">
          ${[0, 1, 3]
            .map(
              (t) => `<div class="tile" style="flex:1;height:50px"><span class="dot" style="background:${TIER[t]}"></span><span class="l" style="width:64px;height:5px"></span><span class="l m" style="width:86px;height:4px;margin-top:6px"></span></div>`,
            )
            .join("")}
        </div>
      </div>
    </div>
    <div class="phone">
      <div style="padding:9px 13px 0">
        <span class="l" style="width:42px;height:8px;background:#26262A;margin:0 auto"></span>
        <div class="row" style="gap:6px;margin-top:11px">
          ${mark(13)}
          <span class="l" style="width:36px;height:4.5px"></span>
          <span style="flex:1"></span>
          <span style="display:block;width:15px;height:8px;border-top:2px solid ${C.white};border-bottom:2px solid ${C.white}"></span>
        </div>
        <span class="l" style="width:112px;height:13px;border-radius:3.5px;margin-top:17px"></span>
        <span class="l" style="width:84px;height:13px;border-radius:3.5px;margin-top:7px"></span>
        <span class="l g it" style="width:100px;height:13px;border-radius:3.5px;margin-top:7px;margin-left:2px"></span>
        <span class="l m" style="width:108px;height:4px;margin-top:13px"></span>
        <span class="l m" style="width:86px;height:4px;margin-top:6px"></span>
        <span class="pill g" style="width:100%;margin-top:13px"></span>
        <div class="pic" style="width:100%;height:96px;margin-top:12px">${dish(76)}</div>
      </div>
    </div>
    ${EDGE_ON_LIGHT}`;
  return doc(W, H, css, body);
}

/* 03 — Prosessi: four numbered stops on a flowing path, the last one gold. */
function coverProsessi() {
  const nodes = [
    { x: 104, y: 330, r: 45 },
    { x: 252, y: 174, r: 45 },
    { x: 398, y: 326, r: 45 },
    { x: 528, y: 166, r: 56 },
  ];
  // Stops sit on the crests and troughs, so the path passes through each one level.
  const leg = (a, b) => {
    const k = (b.x - a.x) * 0.52;
    return `C${a.x + k} ${a.y} ${b.x - k} ${b.y} ${b.x} ${b.y}`;
  };
  const start = `M${nodes[0].x} ${nodes[0].y}`;
  const d = start + leg(nodes[0], nodes[1]) + leg(nodes[1], nodes[2]) + leg(nodes[2], nodes[3]);
  const leadIn = `M-14 238C34 238 40 ${nodes[0].y} ${nodes[0].x} ${nodes[0].y}`;
  const last = nodes[3];
  const PATH = 7; // 2.8 px at the 256 px display size, 1.4 px at 128 px
  const css = `.stage{background:#1D1D21} text{font-family:"Geist Mono",monospace;font-weight:500;text-anchor:middle;dominant-baseline:central}`;
  const layer = (content) =>
    `<svg class="abs" xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="inset:0">${content}</svg>`;
  // The field: a sparse dot grid, and a denser one that shows only in the path's wake.
  const ground = layer(`
      <defs>
        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="1.3" fill="${C.white}"/></pattern>
        <pattern id="fine" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="1.7" fill="${C.white}"/></pattern>
        <filter id="blur26" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="24"/></filter>
        <!-- The wake: a soft band that hangs below the path. The dots of the site's hero wave show through it. -->
        <mask id="wake" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}">
          <g transform="translate(0 78)" filter="url(#blur26)" fill="none" stroke="#fff" stroke-width="104">
            <path d="${leadIn}" stroke-opacity=".5"/><path d="${d}"/>
          </g>
        </mask>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#grid)" opacity=".11"/>
      <rect width="${W}" height="${H}" fill="url(#fine)" opacity=".5" mask="url(#wake)"/>`);
  // The subject, drawn over the light so that all three white stops are the same white.
  const subject = layer(`
      <defs>
        <filter id="blur9" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="8"/></filter>
        <filter id="blur4" x="-10%" y="-40%" width="120%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
        <linearGradient id="arrive" gradientUnits="userSpaceOnUse" x1="${nodes[2].x}" y1="0" x2="${last.x}" y2="0">
          <stop offset=".1" stop-color="${C.white}"/><stop offset=".9" stop-color="${C.gold}"/>
        </linearGradient>
      </defs>
      <g fill="none" stroke-linecap="round">
        <path d="${d}" transform="translate(7 12)" stroke="#000" stroke-opacity=".5" stroke-width="${PATH + 1.5}" filter="url(#blur4)"/>
        <path d="${leadIn}" stroke="${C.white}" stroke-opacity=".6" stroke-width="${PATH - 0.5}" stroke-dasharray="1 13"/>
        <path d="${d}" stroke="${C.white}" stroke-width="${PATH}"/>
        <path d="M${nodes[2].x} ${nodes[2].y}${leg(nodes[2], last)}" stroke="url(#arrive)" stroke-width="${PATH}"/>
      </g>
      <circle cx="${last.x}" cy="${last.y}" r="${last.r + 15}" fill="none" stroke="${C.gold}" stroke-opacity=".55" stroke-width="2"/>
      <circle cx="${last.x}" cy="${last.y}" r="${last.r + 31}" fill="none" stroke="${C.gold}" stroke-opacity=".24" stroke-width="2"/>
      ${nodes
        .map((n, i) => {
          const gold = i === 3;
          return `
      <circle cx="${n.x + 8}" cy="${n.y + 14}" r="${n.r}" fill="#000" opacity=".6" filter="url(#blur9)"/>
      <circle cx="${n.x}" cy="${n.y}" r="${n.r}" fill="${gold ? C.gold : C.white}"/>
      <text x="${n.x}" y="${n.y + 1}" font-size="${gold ? 42 : 35}" fill="${gold ? C.goldInk : C.ink}" letter-spacing="-.5">0${i + 1}</text>`;
        })
        .join("")}`);
  return doc(W, H, css, `${ground}${light({ glow: 0.1, shade: 0.4 })}${subject}${EDGE_ON_DARK}`);
}

/* 04 — Hinnasto: the starting price, set large, over the five tier plates. */
function coverHinnasto() {
  const css = `
    .stage{background:#E9E5DA;color:${C.ink}}
    .label{left:46px;top:40px;font-size:29px;color:#5A5953}
    .price{left:37px;top:68px;font-weight:600;font-size:236px;line-height:1;letter-spacing:-.055em;white-space:nowrap}
    .price .eur{font-size:228px;letter-spacing:0;margin-left:.085em;color:${C.goldDeep}}
    .rule{left:46px;right:46px;top:322px;height:2px;background:${C.ink};opacity:.14}
  `;
  const r = 30;
  const cy = r + 14;
  const step = (W - 92 - 2 * r) / 4;
  const rings = TIER.map((hue, i) => {
    const x = 46 + r + i * step;
    return `
      <circle cx="${x + 5}" cy="${cy + 9}" r="${r}" fill="#5A4A1E" opacity=".3" filter="url(#blur6)"/>
      <circle cx="${x}" cy="${cy}" r="${r}" fill="${hue}"/>
      <circle cx="${x}" cy="${cy}" r="${r - 8}" fill="url(#ceramic)"/>
      ${i === 0 ? `<circle cx="${x}" cy="${cy}" r="8.5" fill="${C.ink}"/>` : ""}`;
  }).join("");
  const body = `
    ${light({ glow: 0.45, glowTone: "255,255,255", shade: 0.2, tone: "120,96,40" })}
    <div class="abs mono label">Alkaen</div>
    <div class="abs price">690<span class="serif eur">€</span></div>
    <div class="abs rule"></div>
    <svg class="abs" style="left:0;top:350px" width="${W}" height="110" viewBox="0 0 ${W} 110">
      <defs>
        <filter id="blur6" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
        <radialGradient id="ceramic" cx="34%" cy="28%" r="88%">
          <stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#FBFAF7"/><stop offset="1" stop-color="#E6E3DA"/>
        </radialGradient>
      </defs>
      ${rings}
    </svg>
    ${EDGE_ON_STONE}`;
  return doc(W, H, css, body);
}

/* 05 — Tarjous: the request card, and the request on its way. */
function coverTarjous() {
  const css = `
    .stage{background:#19191C}
    .card{left:52px;top:120px;width:306px;height:262px;border-radius:18px;background:${C.white};transform:rotate(-7deg);padding:24px 26px;color:${C.ink};
      box-shadow:16px 28px 38px rgba(0,0,0,.6),3px 6px 9px rgba(0,0,0,.4)}
    .title{font-size:50px;line-height:1}
    .field{height:38px;border-radius:9px;border:2px solid #D5D2C8;background:#FFFFFF;display:flex;align-items:center;padding:0 12px}
    .ink{display:block;height:7px;border-radius:4px;background:${C.ink}}
    .send{position:absolute;right:26px;bottom:24px;height:50px;padding:0 20px 0 22px;border-radius:25px;background:${C.gold};color:${C.goldInk};font-weight:600;font-size:27px;letter-spacing:-.01em;display:flex;align-items:center;gap:9px}
  `;
  const body = `
    <div class="abs" style="inset:0;background:radial-gradient(64% 76% at 86% 10%, rgba(227,179,65,.26) 0%, rgba(227,179,65,0) 72%)"></div>
    ${light({ glow: 0.09, shade: 0.4 })}
    <svg class="abs" style="inset:0" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      <path d="M340 354C448 374 524 306 506 226" fill="none" stroke="${C.gold}" stroke-width="6" stroke-linecap="round" stroke-dasharray="1 15"/>
    </svg>
    <div class="abs card">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <span class="serif title">Tarjous</span>
        ${mark(30, C.ink)}
      </div>
      <div class="field" style="margin-top:20px"><span class="ink" style="width:120px"></span></div>
      <div class="field" style="margin-top:10px"><span class="ink" style="width:74px;opacity:.28"></span></div>
      <div class="send">Lähetä<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${C.goldInk}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15M13 6l6 6-6 6"/></svg></div>
    </div>
    <svg class="abs" style="left:384px;top:28px;overflow:visible" width="236" height="210" viewBox="0 0 236 210">
      <defs><filter id="blur10" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="9"/></filter></defs>
      <path d="M218 12 12 92l88 34 14 58 46-34z" transform="translate(12 24)" fill="#000" opacity=".5" filter="url(#blur10)"/>
      <path d="M218 12 12 92l88 34z" fill="#FFFFFF"/>
      <path d="M218 12 100 126l14 58z" fill="#B4B0A2"/>
      <path d="M218 12 114 184l46-34z" fill="#E2DFD5"/>
    </svg>
    ${EDGE_ON_DARK}`;
  return doc(W, H, css, body);
}

const COVERS = {
  sivumallit: coverSivumallit,
  palvelu: coverPalvelu,
  prosessi: coverProsessi,
  hinnasto: coverHinnasto,
  tarjous: coverTarjous,
};

/* ───────────────────── social share image (1200 × 630) ───────────────────── */

const OG_W = 1200;
const OG_H = 630;

/**
 * The hero's particle wave as a still: a grid of points on a rolling surface, seen from just
 * above it. Runs inside the page and paints straight onto a canvas. No randomness.
 *
 * The surface is treated as solid. Rows are walked from the viewer outwards while a skyline keeps,
 * for every screen column, the highest point reached so far; a dot that falls below it lies behind
 * a nearer crest and is left out. Without this the far slopes show through the near ones and the
 * dots pile up into bright clumps along the crests.
 */
function paintWave(canvas, o) {
  const ctx = canvas.getContext("2d");
  const scale = canvas.width / o.width;
  ctx.scale(scale, scale);
  ctx.fillStyle = o.color;
  const height = (x, z) =>
    o.swell * Math.sin(0.34 * x + 0.21 * z + 0.9) +
    o.swell * 0.62 * Math.sin(0.17 * z - 0.27 * x + 2.2) +
    o.swell * 0.3 * Math.sin(0.71 * x + 0.09 * z + 4.1);

  const CELL = 2; // width of a skyline column, px
  const PAD = 16; // the skyline runs this far past both edges
  const columns = Math.ceil((o.width + 2 * PAD) / CELL) + 1;
  const skyline = new Float32Array(columns).fill(Infinity);
  const column = (px) => Math.round((px + PAD) / CELL);

  const dots = [];
  for (let z = o.near; z <= o.far; z += o.gapZ) {
    const row = [];
    for (let x = -o.span; x <= o.span; x += o.gapX) {
      const y = height(x, z);
      row.push({
        y,
        px: o.width / 2 + ((x + 0.5 * Math.sin(y * 2 + z * 0.4)) * o.focal) / z,
        py: o.horizon + ((o.eye - y) * o.focal) / z,
      });
    }
    for (const { y, px, py } of row) {
      if (px < -8 || px > o.width + 8 || py > o.height + 8) continue;
      const lift = (y / (o.swell * 1.92) + 1) / 2; // 0 in the troughs, 1 on the crests
      let radius = ((o.dot * (0.55 + 0.75 * lift)) * o.focal) / z;
      let alpha = o.opacity * (0.42 + 0.58 * lift);
      // Haze: the far field thins out instead of closing into a band.
      alpha *= Math.min(1, Math.max(0, (o.far - z) / (o.far * o.haze)));
      if (radius < o.min) {
        alpha *= (radius / o.min) ** 2;
        radius = o.min;
      }
      // Keep the copy clear: dots fade out as they climb towards it.
      alpha *= Math.min(1, Math.max(0, (py - o.clearTop) / (o.clearBottom - o.clearTop)));
      // Behind a nearer crest: gone within a few pixels of the skyline.
      const hidden = py - skyline[Math.min(columns - 1, Math.max(0, column(px)))];
      if (hidden > 0) alpha *= Math.max(0, 1 - hidden / o.fade);
      if (alpha < 0.012) continue;
      dots.push({ px, py, radius, alpha });
    }
    // Raise the skyline to this row.
    for (let i = 1; i < row.length; i++) {
      const a = row[i - 1];
      const b = row[i];
      if (b.px < -PAD || a.px > o.width + PAD) continue;
      const first = Math.max(0, column(a.px));
      const last = Math.min(columns - 1, column(b.px));
      for (let c = first; c <= last; c++) {
        const py = last === first ? a.py : a.py + ((b.py - a.py) * (c - first)) / (last - first);
        if (py < skyline[c]) skyline[c] = py;
      }
    }
  }
  // Far dots first, so nearer ones sit on top.
  for (let i = dots.length - 1; i >= 0; i--) {
    const { px, py, radius, alpha } = dots[i];
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(px, py, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function ogImage() {
  const wave = {
    width: OG_W,
    height: OG_H,
    color: C.white,
    horizon: 436,
    focal: 760,
    eye: 3.3,
    swell: 0.9,
    near: 6,
    far: 150,
    span: 150,
    gapX: 0.3,
    gapZ: 0.62,
    dot: 0.031,
    min: 0.55,
    opacity: 0.95,
    haze: 0.82,
    fade: 3,
    clearTop: 430,
    clearBottom: 496,
  };
  const css = `
    .stage{background:${C.ink};color:${C.white}}
    canvas{position:absolute;inset:0;width:${OG_W}px;height:${OG_H}px}
    .logo{left:72px;top:58px;display:flex;align-items:center;gap:15px}
    .logo .word{display:flex;align-items:baseline;gap:10px;line-height:1}
    .logo .serif{font-size:46px;letter-spacing:-.01em}
    .logo .mono{font-size:25px}
    h1{left:0;right:0;top:124px;text-align:center;font-weight:600;font-size:72px;line-height:1.05;letter-spacing:-.04em}
    h1 em{display:block;font-family:"Instrument Serif",serif;font-style:italic;font-weight:400;font-size:80px;line-height:1;letter-spacing:-.012em;color:${C.gold};margin-top:2px}
    .tag{left:0;right:0;top:380px;text-align:center;font-size:15px;color:${C.mute};white-space:nowrap}
  `;
  const body = `
    <canvas id="wave" width="${OG_W * 2}" height="${OG_H * 2}"></canvas>
    <div class="abs logo">${mark(40)}<span class="word"><span class="serif">Elite</span><span class="mono">Code</span></span></div>
    <h1 class="abs">Ensiluokkaiset<br>verkkosivut,<em>valmiina viikoissa.</em></h1>
    <p class="abs mono tag">Sivumallit · Kiinteä hinta · Julkaisu viikoissa</p>
    <script>(${paintWave.toString()})(document.getElementById("wave"), ${JSON.stringify(wave)})</script>`;
  return doc(OG_W, OG_H, css, body);
}

/* ───────────────────────── touch icon (180 × 180) ───────────────────────── */

function appleIcon() {
  // Full bleed: iOS rounds the corners itself. The same mark as app/icon.svg at 7/8 of its size
  // (17.5 units from tip to tip instead of 20): a home-screen icon is never shown as small as a
  // favicon, so it can afford more air around the mark.
  const body = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 32 32">
    <rect width="32" height="32" fill="${C.ink}"/>
    <g fill="none" stroke="${C.gold}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14.25 9 7.25 16l7 7"/><path d="M17.75 9 24.75 16l-7 7"/>
    </g>
  </svg>`;
  return doc(180, 180, `.stage{background:${C.ink}}`, body);
}

/* ───────────────────────────── rendering ───────────────────────────── */

async function render(browser, html, width, height, { scale = 2 } = {}) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: scale });
  try {
    await page.setContent(html, { waitUntil: "networkidle" });
    const missing = await page.evaluate(async (faces) => {
      await Promise.all(faces.map((face) => document.fonts.load(face, "Aäö€09")));
      await document.fonts.ready;
      return faces.filter((face) => !document.fonts.check(face, "Aäö€09"));
    }, FONT_FACES);
    if (missing.length) throw new Error(`Fonts did not load (is fonts.googleapis.com reachable?): ${missing.join(", ")}`);
    const shot = await page.locator(".stage").screenshot();
    return sharp(shot).resize(width, height, { kernel: "lanczos3" });
  } finally {
    await page.close();
  }
}

async function main() {
  const args = process.argv.slice(2);
  const value = (flag) => (args.includes(flag) ? args[args.indexOf(flag) + 1] : undefined);
  const only = value("--only")?.split(",");
  const previewDir = value("--preview");
  const wanted = (name) => !only || only.includes(name);
  if (previewDir) fs.mkdirSync(previewDir, { recursive: true });

  const report = [];
  const save = async (file, buffer) => {
    const target = path.join(ROOT, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, buffer);
    report.push(`${file.padEnd(30)} ${(buffer.length / 1024).toFixed(1).padStart(6)} KB`);
  };

  const browser = await chromium.launch();
  try {
    for (const [name, build] of Object.entries(COVERS)) {
      if (!wanted(name)) continue;
      const image = await render(browser, build(), W, H);
      if (previewDir) await image.clone().png().toFile(path.join(previewDir, `${name}.png`));
      await save(`public/nav/${name}.webp`, await image.flatten({ background: C.ink }).webp({ quality: 86, effort: 6, smartSubsample: true }).toBuffer());
    }
    if (wanted("og")) {
      const image = await render(browser, ogImage(), OG_W, OG_H);
      const png = await image.flatten({ background: C.ink }).png({ palette: true, colours: 256, dither: 0.6, effort: 10, compressionLevel: 9 }).toBuffer();
      if (previewDir) fs.writeFileSync(path.join(previewDir, "og.png"), png);
      await save("app/opengraph-image.png", png);
    }
    if (wanted("apple")) {
      const image = await render(browser, appleIcon(), 180, 180, { scale: 4 });
      const png = await image.flatten({ background: C.ink }).removeAlpha().png({ compressionLevel: 9 }).toBuffer();
      if (previewDir) fs.writeFileSync(path.join(previewDir, "apple-icon.png"), png);
      await save("app/apple-icon.png", png);
    }
  } finally {
    await browser.close();
  }
  console.log(report.join("\n"));
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

// For trying out a variant from another script without writing any files.
module.exports = { C, TIER, W, H, OG_W, OG_H, doc, mark, light, edge, render, COVERS, ogImage, appleIcon };
