import { ArrowRight, Mail, Phone, Plus } from "lucide-react";

import { SectionHead } from "./section-head";

const FAQS = [
  { q: "Kuinka nopeasti saan sivuston valmiiksi?", a: "Startti-paketti valmistuu tyypillisesti viikossa, Yritys-paketti 2–3 viikossa ja verkkokauppa 4–6 viikossa. Aikatauluun vaikuttaa myös se, kuinka nopeasti saamme sisällöt sinulta." },
  { q: "Voinko päivittää sivuja itse?", a: "Kyllä. Yritys- ja Verkkokauppa-paketeissa on helppokäyttöinen sisällönhallinta, ja koulutamme sinut käyttämään sitä." },
  { q: "Kuuluuko domain ja webhotelli hintaan?", a: "Ensimmäisen vuoden domain ja hosting sisältyvät kaikkiin paketteihin. Sen jälkeen ne kuuluvat ylläpitosopimukseen (alk. 39 €/kk)." },
  { q: "Kirjoitatteko myös tekstit?", a: "Voimme kirjoittaa myyvät ja hakukoneystävälliset tekstit puolestasi lisäpalveluna. Kerro tästä tarjouspyynnössä." },
  { q: "Mikä ilmainen demo on?", a: "Kerrot lyhyesti, millaisen sivuston haluat, ja saat sähköpostiisi muutamassa minuutissa linkin demosivustoon yrityksesi nimellä. Demo näyttää suunnan, ja oikea sivusto tehdään yhdessä sen pohjalta." },
  { q: "Entä jos en ole tyytyväinen?", a: "Ulkoasua muokataan, kunnes olet tyytyväinen. Julkaisun jälkeen saat 30 päivän takuun, jonka aikana korjaamme viat veloituksetta." },
];

export function Faq() {
  return (
    <section id="ukk" className="bg-white px-4 pt-4 pb-24 sm:px-6 lg:pt-8 lg:pb-32">
      <div className="mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-8">
        <SectionHead chip="UKK" title="Usein kysyttyä" align="left" className="lg:col-start-1 lg:row-start-1">
          Vastaukset yleisimpiin kysymyksiin. Jos jokin jäi epäselväksi, kysy suoraan.
        </SectionHead>

        <div className="flex flex-col gap-3 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          {FAQS.map((f, i) => (
            <details
              key={f.q}
              open={i === 0}
              className="group rounded-[20px] bg-[var(--nexa-surface)] ring-1 ring-[var(--border)] transition-colors open:bg-white open:shadow-[0_12px_32px_-18px_rgba(26,11,84,.35)] [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-base font-semibold text-[var(--nexa-navy)] sm:px-6">
                {f.q}
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-[var(--nexa-navy)] ring-1 ring-[var(--border)] transition-transform duration-200 group-open:rotate-45 group-open:bg-[var(--nexa-navy)] group-open:text-white">
                  <Plus className="size-4" aria-hidden />
                </span>
              </summary>
              <p className="px-5 pb-5 text-[15px] leading-relaxed text-[var(--nexa-muted)] sm:px-6">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="rounded-[24px] bg-[var(--nexa-ink)] p-6 text-white lg:col-start-1 lg:row-start-2 lg:self-start">
          <p className="text-lg font-semibold">Kysy suoraan</p>
          <p className="mt-1 text-[15px] text-[var(--nexa-lavender-2)]">Vastaamme yhden arkipäivän sisällä.</p>
          <ul className="mt-5 space-y-3 text-[15px]">
            <li className="flex items-center gap-3">
              <Phone className="size-4 text-[var(--nexa-accent)]" aria-hidden />
              <a href="tel:+358401234567" className="select-all hover:underline">040 123 4567</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="size-4 text-[var(--nexa-accent)]" aria-hidden />
              <a href="mailto:moi@sivuseppa.fi" className="select-all hover:underline">moi@sivuseppa.fi</a>
            </li>
          </ul>
          <a href="#yhteys" className="group mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-[var(--nexa-navy)] transition-colors hover:bg-[#efeafd]">
            Lähetä kysymys
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
