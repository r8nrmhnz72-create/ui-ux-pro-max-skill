import { ChevronDown } from "lucide-react";

import { SectionHead } from "./section-head";

const FAQS = [
  { q: "Kuinka nopeasti saan sivuston valmiiksi?", a: "Startti-paketti valmistuu tyypillisesti viikossa, Yritys-paketti 2–3 viikossa ja verkkokauppa 4–6 viikossa. Aikatauluun vaikuttaa myös se, kuinka nopeasti saamme sisällöt sinulta." },
  { q: "Voinko päivittää sivuja itse?", a: "Kyllä. Yritys- ja Verkkokauppa-paketeissa on helppokäyttöinen sisällönhallinta, ja koulutamme sinut käyttämään sitä." },
  { q: "Kuuluuko domain ja webhotelli hintaan?", a: "Ensimmäisen vuoden domain ja hosting sisältyvät kaikkiin paketteihin. Sen jälkeen ne kuuluvat ylläpitosopimukseen (alk. 39 €/kk)." },
  { q: "Kirjoitatteko myös tekstit?", a: "Voimme kirjoittaa myyvät ja hakukoneystävälliset tekstit puolestasi lisäpalveluna. Kerro tästä tarjouspyynnössä." },
  { q: "Entä jos en ole tyytyväinen?", a: "Ulkoasua muokataan, kunnes olet tyytyväinen. Julkaisun jälkeen saat 30 päivän takuun, jonka aikana korjaamme viat veloituksetta." },
];

export function Faq() {
  return (
    <section
      id="ukk"
      className="scroll-mt-24 bg-[var(--nexa-chip)]"
      style={{ padding: "clamp(64px, 8vw, 120px) clamp(16px, 4vw, 40px)" }}
    >
      <SectionHead chip="UKK" title="Usein kysyttyä" />
      <div className="mx-auto mt-12 flex max-w-3xl flex-col gap-3">
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="nexa-soft-shadow group rounded-[18px] bg-white px-6 py-5 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-medium text-[var(--nexa-navy)]">
              {f.q}
              <ChevronDown
                className="h-5 w-5 shrink-0 text-[var(--nexa-lavender-3)] transition-transform group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-[var(--nexa-lavender-3)]">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
