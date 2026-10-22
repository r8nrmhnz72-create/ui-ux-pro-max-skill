import { GradientText } from "./primitives";
import { ServiceCard, type ServiceCardProps } from "./service-card";

const TRUSTED_BG =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260418_120332_3b24257a-afe6-48ca-875f-78147370f403.png&w=1280&q=85";

const CARDS: ServiceCardProps[] = [
  {
    label: "Suunnittelu",
    level: 1,
    title: "Brändisi näköinen ulkoasu, ei valmispohjaa.",
    bullets: ["Ulkoasuluonnos kommentoitavaksi", "Mobiili ensin"],
  },
  {
    label: "Toteutus",
    level: 2,
    title: "Nopea sivusto, jota päivität itse helposti.",
    bullets: ["90+ PageSpeed-tavoite", "Helppo sisällönhallinta"],
  },
  {
    label: "Näkyvyys",
    level: 3,
    title: "Asiakkaat löytävät sinut Googlesta.",
    bullets: ["Hakukoneoptimointi", "Google-yritysprofiili"],
  },
  {
    label: "Ylläpito",
    level: 4,
    title: "Me huolehdimme sivustosta, sinä bisneksestä.",
    bullets: ["Päivitykset ja varmuuskopiot", "Tuki suomeksi"],
  },
];

export function Trusted() {
  return (
    <section
      id="build"
      data-slot="trusted"
      className="relative flex flex-col items-center"
      style={{
        backgroundImage: `url(${TRUSTED_BG}), radial-gradient(70% 60% at 50% 0%, rgba(172,36,255,.35), transparent 70%), linear-gradient(#000201, #120a3a)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding:
          "clamp(100px, 12vw, 180px) clamp(16px, 4vw, 40px) clamp(100px, 12vw, 160px)",
        gap: 110,
      }}
    >
      <div className="flex w-full max-w-[1200px] flex-col items-center gap-5 text-center">
        <h2
          className="font-medium text-white text-balance"
          style={{ fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.2 }}
        >
          Kaikki mitä yrityksesi tarvitsee verkossa,
          <br />
          <GradientText>suunnittelusta ylläpitoon.</GradientText>
        </h2>
        <p
          className="text-[var(--nexa-lavender-2)]"
          style={{ fontSize: "clamp(14px, 1.25vw, 18px)" }}
        >
          Yksi kumppani koko matkalle. Yli 120 suomalaista yritystä on jo
          saanut meiltä sivuston, joka tekee töitä niiden puolesta.
        </p>
      </div>

      <div className="grid w-full max-w-[1200px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card) => (
          <ServiceCard key={card.label} {...card} />
        ))}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[180px]"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgb(255, 255, 255))",
        }}
      />
    </section>
  );
}
