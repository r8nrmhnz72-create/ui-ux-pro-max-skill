import { ChevronDown } from "lucide-react";
import { SectionHeading } from "./section-heading";

const faqs = [
  { q: "Kuinka nopeasti saan sivuston valmiiksi?", a: "Startti-paketti valmistuu tyypillisesti viikossa, Yritys-paketti 2–3 viikossa ja verkkokauppa 4–6 viikossa. Aikataulu riippuu myös siitä, kuinka nopeasti saamme sisällöt sinulta." },
  { q: "Voinko päivittää sivuja itse?", a: "Kyllä. Yritys- ja Verkkokauppa-paketeissa on helppokäyttöinen sisällönhallinta, ja koulutamme sinut käyttämään sitä." },
  { q: "Kuuluuko domain ja webhotelli hintaan?", a: "Ensimmäisen vuoden domain ja hosting sisältyvät kaikkiin paketteihin. Sen jälkeen ne kuuluvat ylläpitosopimukseen (alk. 39 €/kk)." },
  { q: "Kirjoitatteko myös tekstit?", a: "Voimme kirjoittaa myyvät ja hakukoneystävälliset tekstit puolestasi lisäpalveluna. Kerro tästä tarjouspyynnössä." },
  { q: "Entä jos en ole tyytyväinen?", a: "Ulkoasua muokataan, kunnes olet tyytyväinen. Julkaisun jälkeen saat 30 päivän takuun, jonka aikana korjaamme kaikki viat veloituksetta." },
];

export function Faq() {
  return (
    <section id="ukk" className="scroll-mt-8 px-6 py-24 sm:py-32">
      <SectionHeading eyebrow="UKK" title="Usein kysyttyä" />
      <div className="mx-auto mt-12 max-w-3xl divide-y divide-white/10 rounded-3xl bg-[var(--bg-100)] ring-1 ring-white/10">
        {faqs.map((f) => (
          <details key={f.q} className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between gap-4 text-base font-medium text-white">
              {f.q}
              <ChevronDown className="h-5 w-5 shrink-0 text-[var(--text-300)] transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-300)]">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
