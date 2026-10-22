import { Globe, LayoutTemplate, PenLine, RefreshCw, Search, ShoppingBag, CalendarCheck, Utensils } from "lucide-react";

import RuixenMoonChat, { type QuickActionItem } from "@/components/ui/ruixen-moon-chat";

const BRIEF_BG =
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=80";

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
      className="scroll-mt-24"
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
        backgroundImageUrl={BRIEF_BG}
        title="Kuvaile unelmiesi sivusto"
        description="Kerro omin sanoin, mitä tarvitset, tai valitse valmis aihe. Teksti siirtyy tarjouspyyntöön, ja vastaamme päivässä."
        placeholder="Esim. Parturiliike Tampereella, tarvitsemme sivut ja ajanvarauksen..."
        sendLabel="Siirrä tarjouspyyntöön"
        quickActions={ACTIONS}
        onSubmit={onSubmit}
      />
    </section>
  );
}
