import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

// Illustrations of example client sites, drawn with CSS only (no images, so they
// also render in the artifact preview). Everything inside a frame is sized in
// `em`, and the frame sets its font size in container units, so a mockup keeps
// its proportions from a 320px phone column up to a wide desktop card.

const SERIF = '"Instrument Serif", Georgia, "Times New Roman", serif';
const SANS = '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif';

type Css = CSSProperties;

function LockGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="0.85em" height="0.85em" fill="none" aria-hidden>
      <rect x="3" y="7" width="10" height="7" rx="1.5" fill="currentColor" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function BrowserFrame({
  url,
  label,
  children,
  className,
}: {
  url: string;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "overflow-hidden rounded-[14px] bg-[#17112e] shadow-[0_40px_80px_-32px_rgba(11,5,38,0.6)] ring-1 ring-white/10",
        className,
      )}
      style={{ containerType: "inline-size" }}
    >
      <div aria-hidden style={{ fontSize: "2.4cqw", fontFamily: SANS }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.45em", padding: "0.7em 0.9em", background: "#1d1637" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span key={c} style={{ width: "0.62em", height: "0.62em", borderRadius: "50%", background: c }} />
          ))}
          <div
            style={{
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              gap: "0.45em",
              padding: "0.3em 1.2em",
              borderRadius: 999,
              background: "rgba(255,255,255,.07)",
              color: "rgba(255,255,255,.7)",
              fontSize: "0.72em",
            }}
          >
            <LockGlyph />
            {url}
          </div>
          <span style={{ width: "2.3em" }} />
        </div>
        {children}
      </div>
    </div>
  );
}

export function PhoneFrame({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn("rounded-[24px] bg-[#0b0718] p-[5px] shadow-[0_30px_60px_-20px_rgba(11,5,38,0.75)] ring-1 ring-white/15", className)}
      style={{ containerType: "inline-size" }}
    >
      <div
        aria-hidden
        style={{ position: "relative", overflow: "hidden", borderRadius: 19, aspectRatio: "9 / 18.5", fontSize: "5.4cqw", fontFamily: SANS }}
      >
        <div
          style={{
            position: "absolute",
            zIndex: 2,
            top: "0.55em",
            left: "50%",
            transform: "translateX(-50%)",
            width: "32%",
            height: "1.15em",
            borderRadius: 999,
            background: "#0b0718",
          }}
        />
        {children}
      </div>
    </div>
  );
}

function Pill({ children, style }: { children: ReactNode; style?: Css }) {
  return (
    <span style={{ display: "inline-block", fontSize: "0.68em", fontWeight: 700, padding: "0.6em 1.15em", borderRadius: 999, whiteSpace: "nowrap", ...style }}>
      {children}
    </span>
  );
}

function MockNav({ brand, links, cta, ctaStyle, linkColor }: { brand: ReactNode; links: string[]; cta: string; ctaStyle: Css; linkColor: string }) {
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1em 1.8em" }}>
      {brand}
      <div style={{ display: "flex", gap: "1.6em", fontSize: "0.7em", color: linkColor }}>
        {links.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
      <Pill style={ctaStyle}>{cta}</Pill>
    </div>
  );
}

/* ---------- Studio Lumo: beauty salon, soft and light ---------- */

const LUMO = { bg: "#fbf1ef", ink: "#3d1f2b", rose: "#c2557a", muted: "#8a6b76", line: "#f1dcd8" };

function LumoBooking({ compact = false }: { compact?: boolean }) {
  const days = [
    ["Ma", "12"],
    ["Ti", "13"],
    ["Ke", "14"],
    ["To", "15"],
  ];
  const times = compact ? ["10.00", "11.30", "13.00"] : ["10.00", "11.30", "13.00", "14.30", "16.00", "17.30"];
  return (
    <div style={{ background: "#fff", borderRadius: "1.1em", padding: compact ? "0.9em" : "1em 1.1em", boxShadow: "0 1.2em 2.6em -1.2em rgba(61,31,43,.35)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontWeight: 700, fontSize: "0.85em" }}>Varaa aika</span>
        <span style={{ fontSize: "0.62em", color: LUMO.muted }}>Marraskuu</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.4em", marginTop: "0.7em" }}>
        {days.map(([d, n]) => {
          const on = n === "13";
          return (
            <div key={n} style={{ textAlign: "center", padding: "0.45em 0", borderRadius: "0.6em", background: on ? LUMO.rose : LUMO.bg, color: on ? "#fff" : LUMO.ink }}>
              <div style={{ fontSize: "0.55em", opacity: 0.8 }}>{d}</div>
              <div style={{ fontSize: "0.85em", fontWeight: 700 }}>{n}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.4em", marginTop: "0.55em" }}>
        {times.map((t) => {
          const on = t === "11.30";
          return (
            <div
              key={t}
              style={{
                textAlign: "center",
                fontSize: "0.62em",
                padding: "0.45em 0",
                borderRadius: "0.55em",
                border: `1px solid ${on ? LUMO.rose : LUMO.line}`,
                background: on ? "#fdeef2" : "#fff",
                color: on ? LUMO.rose : LUMO.ink,
                fontWeight: on ? 700 : 500,
              }}
            >
              {t}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: "0.75em", textAlign: "center", background: LUMO.ink, color: "#fff", borderRadius: "0.6em", padding: "0.6em", fontSize: "0.68em", fontWeight: 700 }}>
        Vahvista varaus
      </div>
    </div>
  );
}

export function LumoSite() {
  return (
    <div style={{ position: "relative", height: "26em", overflow: "hidden", background: LUMO.bg, color: LUMO.ink }}>
      <div style={{ position: "absolute", width: "24em", height: "24em", right: "-5em", top: "-7em", borderRadius: "50%", background: "radial-gradient(circle at 40% 40%, #f6c3be, rgba(246,195,190,0) 70%)" }} />
      <div style={{ position: "absolute", width: "18em", height: "18em", left: "-6em", bottom: "-8em", borderRadius: "50%", background: "radial-gradient(circle, #f2d7b6, rgba(242,215,182,0) 70%)" }} />
      <MockNav
        brand={<span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "1.7em", lineHeight: 1 }}>lumo</span>}
        links={["Hoidot", "Hinnasto", "Lahjakortit"]}
        linkColor={LUMO.muted}
        cta="Varaa aika"
        ctaStyle={{ background: LUMO.rose, color: "#fff" }}
      />
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: "1.6em", padding: "0.8em 1.8em 0", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "0.62em", letterSpacing: "0.2em", textTransform: "uppercase", color: LUMO.rose, fontWeight: 700 }}>Kauneushoitola · Helsinki</div>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "3.4em", lineHeight: 0.98, marginTop: "0.18em" }}>
            Hetki vain
            <br />
            sinulle.
          </div>
          <div style={{ fontSize: "0.76em", lineHeight: 1.55, color: LUMO.muted, marginTop: "0.9em", maxWidth: "19em" }}>
            Kasvohoidot, ripset ja hieronnat rauhallisessa studiossa Kalliossa.
          </div>
          <div style={{ display: "flex", gap: "0.6em", marginTop: "1.2em" }}>
            <Pill style={{ background: LUMO.rose, color: "#fff" }}>Varaa aika</Pill>
            <Pill style={{ border: `1px solid ${LUMO.ink}33`, color: LUMO.ink }}>Hinnasto</Pill>
          </div>
        </div>
        <LumoBooking />
      </div>
      <div style={{ position: "absolute", left: "1.8em", right: "1.8em", bottom: "1.2em", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.6em" }}>
        {[
          ["Kasvohoito", "75 €"],
          ["Ripset", "45 €"],
          ["Hieronta", "60 €"],
        ].map(([n, p]) => (
          <div key={n} style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,.75)", border: `1px solid ${LUMO.line}`, borderRadius: "0.8em", padding: "0.65em 0.85em", fontSize: "0.7em" }}>
            <span>{n}</span>
            <span style={{ color: LUMO.rose, fontWeight: 700 }}>{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LumoPhone() {
  return (
    <div style={{ position: "relative", height: "100%", overflow: "hidden", background: LUMO.bg, color: LUMO.ink }}>
      <div style={{ position: "absolute", width: "16em", height: "16em", right: "-6em", top: "-5em", borderRadius: "50%", background: "radial-gradient(circle, #f6c3be, rgba(246,195,190,0) 70%)" }} />
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "2.6em 1.2em 0.6em" }}>
        <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "1.5em" }}>lumo</span>
        <span style={{ display: "grid", gap: "0.22em" }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: "1.1em", height: "0.14em", background: LUMO.ink, borderRadius: 2 }} />
          ))}
        </span>
      </div>
      <div style={{ position: "relative", padding: "0.8em 1.2em" }}>
        <div style={{ fontSize: "0.55em", letterSpacing: "0.18em", textTransform: "uppercase", color: LUMO.rose, fontWeight: 700 }}>Kauneushoitola</div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "2.5em", lineHeight: 0.98, marginTop: "0.2em" }}>
          Hetki vain sinulle.
        </div>
        <div style={{ fontSize: "0.7em", lineHeight: 1.5, color: LUMO.muted, marginTop: "0.7em" }}>Kasvohoidot, ripset ja hieronnat.</div>
        <div style={{ marginTop: "0.9em", textAlign: "center", background: LUMO.rose, color: "#fff", borderRadius: 999, padding: "0.65em", fontSize: "0.72em", fontWeight: 700 }}>
          Varaa aika
        </div>
        <div style={{ marginTop: "1em" }}>
          <LumoBooking compact />
        </div>
      </div>
    </div>
  );
}

/* ---------- Bistro Kaneli: restaurant, dark and warm ---------- */

const KANELI = { bg: "#1f1510", cream: "#f6ead9", amber: "#e8a33d", muted: "rgba(246,234,217,.62)", line: "rgba(246,234,217,.14)" };

function Plate() {
  const blob = (style: Css): Css => ({ position: "absolute", ...style });
  return (
    <div style={{ position: "relative", width: "15em", height: "15em", margin: "0 auto" }}>
      <div style={blob({ inset: "-6%", borderRadius: "50%", background: "radial-gradient(circle, rgba(232,163,61,.35), rgba(232,163,61,0) 70%)" })} />
      <div style={blob({ inset: 0, borderRadius: "50%", background: "radial-gradient(circle, #efe6d8 0 52%, #e2d5c2 53% 56%, #f6efe4 57% 69%, rgba(0,0,0,.4) 70%, rgba(0,0,0,0) 75%)" })} />
      {/* salmon fillet */}
      <div
        style={blob({
          left: "30%",
          top: "33%",
          width: "40%",
          height: "26%",
          borderRadius: "45% 55% 50% 50% / 55% 45% 55% 45%",
          background: "repeating-linear-gradient(115deg, #ee8656 0 0.55em, #f8a77d 0.55em 0.75em)",
          boxShadow: "inset -0.4em -0.3em 0.8em rgba(120,40,10,.35)",
          transform: "rotate(-12deg)",
        })}
      />
      {/* greens */}
      {[
        { left: "24%", top: "55%", width: "22%", height: "16%", background: "#6f9a45" },
        { left: "52%", top: "58%", width: "20%", height: "14%", background: "#8db35a" },
        { left: "58%", top: "26%", width: "16%", height: "12%", background: "#5f8a3a" },
      ].map((g, i) => (
        <div key={i} style={blob({ ...g, borderRadius: "60% 40% 55% 45% / 50% 60% 40% 50%", boxShadow: "inset 0 -0.3em 0.5em rgba(0,0,0,.25)" })} />
      ))}
      {/* lemon */}
      <div style={blob({ left: "26%", top: "28%", width: "12%", height: "12%", borderRadius: "50%", background: "radial-gradient(circle, #fbe27a 0 55%, #fff6c9 56% 70%, #f0cf4d 71%)" })} />
      {/* sauce dots */}
      {[
        ["46%", "68%"],
        ["40%", "72%"],
        ["66%", "45%"],
      ].map(([l, t]) => (
        <div key={l + t} style={blob({ left: l, top: t, width: "5%", height: "5%", borderRadius: "50%", background: "#f4e7c9" })} />
      ))}
      {/* cutlery */}
      <div style={blob({ left: "-1.4em", top: "18%", width: "0.45em", height: "64%", borderRadius: 999, background: "linear-gradient(#d8cfc1, #a79e90)" })} />
      <div style={blob({ right: "-1.4em", top: "18%", width: "0.45em", height: "64%", borderRadius: 999, background: "linear-gradient(#d8cfc1, #a79e90)" })} />
    </div>
  );
}

export function KaneliSite() {
  return (
    <div style={{ position: "relative", height: "26em", overflow: "hidden", background: KANELI.bg, color: KANELI.cream }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 70% at 78% 45%, rgba(232,163,61,.2), rgba(232,163,61,0) 70%)" }} />
      <MockNav
        brand={<span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "1.6em", lineHeight: 1 }}>Kaneli</span>}
        links={["Ruokalista", "Lounas", "Yhteys"]}
        linkColor={KANELI.muted}
        cta="Varaa pöytä"
        ctaStyle={{ background: KANELI.amber, color: KANELI.bg }}
      />
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "1em", padding: "0.6em 1.8em 0", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "0.62em", letterSpacing: "0.2em", textTransform: "uppercase", color: KANELI.amber, fontWeight: 700 }}>Bistro · Tampere</div>
          <div style={{ fontFamily: SERIF, fontSize: "3.3em", lineHeight: 0.98, marginTop: "0.18em" }}>
            Makuja, joihin
            <br />
            <span style={{ fontStyle: "italic", color: KANELI.amber }}>palataan.</span>
          </div>
          <div style={{ fontSize: "0.76em", lineHeight: 1.55, color: KANELI.muted, marginTop: "0.9em", maxWidth: "20em" }}>
            Kauden raaka-aineista tehtyä ruokaa Tammelan torin laidalla.
          </div>
          <div style={{ display: "flex", gap: "0.6em", marginTop: "1.2em" }}>
            <Pill style={{ background: KANELI.amber, color: KANELI.bg }}>Varaa pöytä</Pill>
            <Pill style={{ border: `1px solid ${KANELI.line}`, color: KANELI.cream }}>Ruokalista</Pill>
          </div>
        </div>
        <Plate />
      </div>
      <div style={{ position: "absolute", left: "1.8em", right: "1.8em", bottom: "1.2em", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.6em" }}>
        {[
          ["Lohi & tilli", "24 €"],
          ["Härkä & juuret", "29 €"],
          ["Kanelipulla", "5 €"],
        ].map(([n, p]) => (
          <div key={n} style={{ display: "flex", justifyContent: "space-between", border: `1px solid ${KANELI.line}`, background: "rgba(246,234,217,.05)", borderRadius: "0.8em", padding: "0.65em 0.85em", fontSize: "0.7em" }}>
            <span>{n}</span>
            <span style={{ color: KANELI.amber, fontWeight: 700 }}>{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Virta Rakennus: construction, bold and light ---------- */

const VIRTA = { bg: "#eef0f3", ink: "#101826", yellow: "#f5b301", gray: "#5b6474", line: "#d7dce3" };

function Building() {
  const windows = (cols: number, rows: number, seed: number) =>
    Array.from({ length: cols * rows }, (_, i) => ((i * 7 + seed) % 5 === 0 ? "#ffd76a" : "rgba(255,255,255,.14)"));
  const grid = (cols: number, rows: number, seed: number): ReactNode => (
    <div style={{ position: "absolute", inset: "0.9em 0.8em", display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "0.45em" }}>
      {windows(cols, rows, seed).map((c, i) => (
        <span key={i} style={{ background: c, borderRadius: "0.12em" }} />
      ))}
    </div>
  );
  return (
    <div style={{ position: "relative", height: "15.5em", borderRadius: "1em", overflow: "hidden", background: "linear-gradient(#dde4ec, #f5f7f9)" }}>
      <div style={{ position: "absolute", right: "12%", top: "12%", width: "3em", height: "3em", borderRadius: "50%", background: "#ffd76a", opacity: 0.85 }} />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <path d="M72 86 V14 M72 16 H18 M72 16 L84 24 M30 16 V40" stroke={VIRTA.yellow} strokeWidth="1.6" fill="none" vectorEffect="non-scaling-stroke" />
        <rect x="26" y="40" width="8" height="5" fill={VIRTA.ink} />
      </svg>
      <div style={{ position: "absolute", left: "10%", bottom: "2.2em", width: "44%", height: "62%", background: "#2a3445", borderRadius: "0.3em 0.3em 0 0" }}>{grid(4, 6, 1)}</div>
      <div style={{ position: "absolute", left: "58%", bottom: "2.2em", width: "30%", height: "40%", background: "#46546a", borderRadius: "0.3em 0.3em 0 0" }}>{grid(3, 3, 3)}</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "2.2em", background: `repeating-linear-gradient(-45deg, ${VIRTA.yellow} 0 0.9em, ${VIRTA.ink} 0.9em 1.8em)` }} />
    </div>
  );
}

export function VirtaSite() {
  return (
    <div style={{ position: "relative", height: "26em", overflow: "hidden", background: VIRTA.bg, color: VIRTA.ink }}>
      <MockNav
        brand={
          <span style={{ display: "flex", alignItems: "center", gap: "0.45em", fontWeight: 800, letterSpacing: "0.1em", fontSize: "0.95em" }}>
            <span style={{ display: "grid", placeItems: "center", width: "1.4em", height: "1.4em", background: VIRTA.yellow, borderRadius: "0.2em" }}>V</span>
            VIRTA
          </span>
        }
        links={["Palvelut", "Referenssit", "Yhteys"]}
        linkColor={VIRTA.gray}
        cta="Pyydä tarjous"
        ctaStyle={{ background: VIRTA.ink, color: "#fff", borderRadius: "0.35em" }}
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.05fr", gap: "1.4em", padding: "0.6em 1.8em 0", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "0.62em", letterSpacing: "0.16em", textTransform: "uppercase", color: VIRTA.gray, fontWeight: 700 }}>Rakennusliike · Turku</div>
          <div style={{ fontSize: "2.7em", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.02em", textTransform: "uppercase", marginTop: "0.25em" }}>
            Rakennamme
            <br />
            kestävästi.
          </div>
          <div style={{ fontSize: "0.76em", lineHeight: 1.55, color: VIRTA.gray, marginTop: "0.9em", maxWidth: "19em" }}>
            Uudisrakennukset, saneeraukset ja kylpyhuoneet avaimet käteen.
          </div>
          <div style={{ display: "flex", gap: "0.6em", marginTop: "1.2em" }}>
            <Pill style={{ background: VIRTA.yellow, color: VIRTA.ink, borderRadius: "0.35em" }}>Pyydä tarjous</Pill>
            <Pill style={{ border: `1.5px solid ${VIRTA.ink}`, color: VIRTA.ink, borderRadius: "0.35em" }}>Referenssit</Pill>
          </div>
        </div>
        <Building />
      </div>
      <div style={{ position: "absolute", left: "1.8em", right: "1.8em", bottom: "1.2em", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.6em" }}>
        {["Uudisrakennus", "Saneeraus", "Kylpyhuoneet"].map((n, i) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: "0.6em", background: "#fff", border: `1px solid ${VIRTA.line}`, borderRadius: "0.4em", padding: "0.55em 0.7em", fontSize: "0.7em", fontWeight: 600 }}>
            <span style={{ background: VIRTA.yellow, borderRadius: "0.25em", padding: "0.15em 0.4em", fontSize: "0.85em", fontWeight: 800 }}>0{i + 1}</span>
            {n}
          </div>
        ))}
      </div>
    </div>
  );
}
