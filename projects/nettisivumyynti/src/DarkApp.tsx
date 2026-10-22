import ResponsiveHeroBanner from "@/components/ui/responsive-hero-banner";
import { Services } from "@/components/sections/services";
import { Work } from "@/components/sections/work";
import { Pricing } from "@/components/sections/pricing";
import { Process } from "@/components/sections/process";
import { Faq } from "@/components/sections/faq";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";

const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export default function DarkApp() {
  return (
    <>
      <ResponsiveHeroBanner
        logoUrl="/logo.svg"
        logoAlt="Sivuseppä – etusivu"
        backgroundImageUrl={unsplash("photo-1497366216548-37526070297c", 2000)}
        navLinks={[
          { label: "Palvelut", href: "#palvelut", isActive: true },
          { label: "Työnäytteet", href: "#tyot" },
          { label: "Hinnat", href: "#hinnat" },
          { label: "Prosessi", href: "#prosessi" },
          { label: "UKK", href: "#ukk" },
        ]}
        ctaButtonText="Pyydä tarjous"
        ctaButtonHref="#yhteys"
        badgeLabel="Uutta"
        badgeText="Valmis sivusto jopa 2 viikossa"
        title="Nettisivut, jotka"
        titleLine2="tuovat asiakkaita"
        description="Suunnittelemme ja rakennamme yrityksellesi nopean, hakukoneystävällisen ja mobiilissa toimivan sivuston kiinteään hintaan. Ei piilokuluja, ei teknistä jargonia."
        primaryButtonText="Pyydä ilmainen tarjous"
        primaryButtonHref="#yhteys"
        secondaryButtonText="Katso työnäytteet"
        secondaryButtonHref="#tyot"
        partnersTitle="Yli 120 suomalaista yritystä luottaa meihin"
        partners={[
          { name: "Kahvila Kaneli", logoUrl: "/clients/kaneli.svg", href: "#tyot" },
          { name: "Virta Rakennus", logoUrl: "/clients/virta.svg", href: "#tyot" },
          { name: "Parturi Saksi", logoUrl: "/clients/saksi.svg", href: "#tyot" },
          { name: "Lumo", logoUrl: "/clients/lumo.svg", href: "#tyot" },
          { name: "Tilitoimisto Tase", logoUrl: "/clients/tase.svg", href: "#tyot" },
        ]}
      />
      <main>
        <Services />
        <Work image={unsplash} />
        <Pricing />
        <Process />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
