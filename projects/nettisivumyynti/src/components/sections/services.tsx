import { Gauge, PenTool, Search, ShoppingBag, Smartphone, Wrench } from "lucide-react";
import { SectionHeading } from "./section-heading";

const services = [
  { icon: PenTool, title: "Räätälöity ulkoasu", text: "Suunnittelemme sivuston brändisi näköiseksi – ei valmispohjia, joita näkee joka toisella kilpailijalla." },
  { icon: Smartphone, title: "Mobiili ensin", text: "Yli 60 % kävijöistä tulee puhelimella. Jokainen sivu toimii moitteetta pienelläkin näytöllä." },
  { icon: Gauge, title: "Salamannopea", text: "Optimoidut kuvat ja kevyt koodi. Tavoitteena 90+ pistettä Googlen PageSpeed-mittauksessa." },
  { icon: Search, title: "Hakukoneoptimointi", text: "Perus-SEO, Google-yritysprofiili ja rakenteinen data mukana, jotta asiakkaat löytävät sinut." },
  { icon: ShoppingBag, title: "Verkkokauppa", text: "Myy tuotteita tai palveluita suoraan sivustolla. Maksutavat Paytrailin tai Stripen kautta." },
  { icon: Wrench, title: "Ylläpito ja tuki", text: "Päivitämme, varmuuskopioimme ja valvomme sivustoa – sinä keskityt omaan bisnekseesi." },
];

export function Services() {
  return (
    <section id="palvelut" className="scroll-mt-8 px-6 py-24 sm:py-32">
      <SectionHeading
        eyebrow="Palvelut"
        title="Kaikki mitä tarvitset verkossa"
        description="Yksi kumppani suunnittelusta julkaisuun ja ylläpitoon."
      />
      <div className="mx-auto mt-14 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map(({ icon: Icon, title, text }) => (
          <article
            key={title}
            className="rounded-3xl bg-[var(--bg-100)] p-7 ring-1 ring-white/10 transition-colors hover:ring-white/20"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
              <Icon className="h-5 w-5 text-white" aria-hidden />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-300)]">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
