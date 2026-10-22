import { CalendarCheck, Globe, LayoutTemplate, PenLine, RefreshCw, Search, ShoppingBag, Sparkles, Utensils } from "lucide-react";

import RuixenMoonChat, { type QuickActionItem } from "@/components/ui/ruixen-moon-chat";

// Navy glow and grid in the site's own palette (an inline SVG, so it needs no network).
const BRIEF_ART = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900' preserveAspectRatio='xMidYMid slice'>" +
    "<defs>" +
    "<radialGradient id='a' cx='.18' cy='.12' r='.6'><stop offset='0' stop-color='#1c4eff' stop-opacity='.55'/><stop offset='1' stop-color='#1c4eff' stop-opacity='0'/></radialGradient>" +
    "<radialGradient id='b' cx='.88' cy='.55' r='.55'><stop offset='0' stop-color='#ac24ff' stop-opacity='.5'/><stop offset='1' stop-color='#ac24ff' stop-opacity='0'/></radialGradient>" +
    "<radialGradient id='c' cx='.5' cy='1.05' r='.5'><stop offset='0' stop-color='#fe881b' stop-opacity='.3'/><stop offset='1' stop-color='#fe881b' stop-opacity='0'/></radialGradient>" +
    "<pattern id='g' width='56' height='56' patternUnits='userSpaceOnUse'><path d='M56 0H0V56' fill='none' stroke='#ffffff' stroke-opacity='.05'/></pattern>" +
    "</defs>" +
    "<rect width='1600' height='900' fill='#0b0526'/><rect width='1600' height='900' fill='url(#a)'/><rect width='1600' height='900' fill='url(#b)'/><rect width='1600' height='900' fill='url(#c)'/><rect width='1600' height='900' fill='url(#g)'/>" +
    "</svg>",
)}`;

const ACTIONS: QuickActionItem[] = [
  { icon: <LayoutTemplate className="w-4 h-4" />, label: "Kotisivu", prompt: "Tarvitsen yrityksellemme selkeät kotisivut, joista näkee palvelut ja yhteystiedot." },
  { icon: <ShoppingBag className="w-4 h-4" />, label: "Verkkokauppa", prompt: "Haluan verkkokaupan, jossa on noin 50 tuotetta ja suomalaiset maksutavat." },
  { icon: <CalendarCheck className="w-4 h-4" />, label: "Ajanvaraus", prompt: "Tarvitsen sivuston, jossa asiakkaat voivat varata ajan suoraan netissä." },
  { icon: <Utensils className="w-4 h-4" />, label: "Ravintola", prompt: "Ravintolallemme sivut, joissa on ruokalista, aukioloajat ja pöytävaraus." },
  { icon: <RefreshCw className="w-4 h-4" />, label: "Uudistus", prompt: "Nykyinen sivustomme on vanha ja hidas. Haluamme sen uudistettavaksi." },
  { icon: <Search className="w-4 h-4" />, label: "Näkyvyys Googlessa", prompt: "Haluamme, että asiakkaat löytävät meidät paremmin Googlesta." },
  { icon: <PenLine className="w-4 h-4" />, label: "Tekstit", prompt: "Tarvitsemme apua myös sivuston tekstien kirjoittamiseen." },
  { icon: <Globe className="w-4 h-4" />, label: "Monikielinen", prompt: "Sivuston pitäisi toimia suomeksi, ruotsiksi ja englanniksi." },
];

export function Brief({ onSubmit }: { onSubmit: (message: string) => void }) {
  return (
    <section
      aria-label="Kuvaile sivustosi"
      className=""
      style={{
        // Shown if the photo can't load.
        backgroundColor: "#0b0526",
        backgroundImage:
          "radial-gradient(60% 50% at 20% 10%, rgba(28,78,255,.45), transparent 70%), radial-gradient(50% 50% at 85% 60%, rgba(172,36,255,.4), transparent 70%)",
      }}
    >
      <RuixenMoonChat
        id="kuvaile"
        className="h-auto min-h-[640px] md:min-h-[720px]"
        backgroundImageUrl={BRIEF_ART}
        overlay={false}
        eyebrow={
          <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-3.5 py-1.5 text-sm text-white/85 ring-1 ring-white/15">
            <Sparkles className="size-4 text-[var(--nexa-accent)]" aria-hidden />
            Ilmainen demo · valmis minuuteissa
          </span>
        }
        title={
          <>
            Kuvaile <span className="nexa-serif nexa-grad-text">unelmiesi sivusto.</span>
          </>
        }
        description="Kerro omin sanoin, mitä tarvitset, tai valitse valmis aihe. Teemme siitä ilmaisen demosivuston ja lähetämme sen sähköpostiisi."
        placeholder="Esim. Parturiliike Tampereella, tarvitsemme sivut ja ajanvarauksen..."
        sendLabel="Jatka demotilaukseen"
        quickActions={ACTIONS}
        onSubmit={onSubmit}
      />
    </section>
  );
}
