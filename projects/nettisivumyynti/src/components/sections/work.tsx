import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "./section-heading";

const projects = [
  { client: "Kahvila Kaneli", type: "Ravintola · Pöytävaraukset", result: "+48 % varauksia", photo: "photo-1554118811-1e0d58224f24" },
  { client: "Virta Rakennus", type: "Rakennusala · Tarjouspyynnöt", result: "3× yhteydenotot", photo: "photo-1503387762-592deb58ef4e" },
  { client: "Lumo Kosmetiikka", type: "Verkkokauppa", result: "+72 % myynti", photo: "photo-1556228578-8c89e6adf883" },
];

interface WorkProps {
  image: (id: string, w?: number) => string;
}

export function Work({ image }: WorkProps) {
  return (
    <section id="tyot" className="scroll-mt-8 bg-[var(--bg-100)]/50 px-6 py-24 sm:py-32">
      <SectionHeading
        eyebrow="Työnäytteet"
        title="Tuloksia, ei pelkkää ulkonäköä"
        description="Muutama esimerkki siitä, mitä uusi sivusto on tehnyt asiakkaidemme liiketoiminnalle."
      />
      <div className="mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-3">
        {projects.map((p) => (
          <article key={p.client} className="group overflow-hidden rounded-3xl bg-[var(--bg-100)] ring-1 ring-white/10">
            <div className="aspect-[4/3] overflow-hidden bg-[var(--bg-200)]">
              <img
                src={image(p.photo, 800)}
                alt={`${p.client} – sivuston kuvitus`}
                loading="lazy"
                width={800}
                height={600}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex items-start justify-between gap-4 p-6">
              <div>
                <h3 className="text-lg font-semibold text-white">{p.client}</h3>
                <p className="mt-1 text-sm text-[var(--text-300)]">{p.type}</p>
              </div>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-[var(--text-300)] transition-colors group-hover:text-white" aria-hidden />
            </div>
            <p className="mx-6 mb-6 inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-300 ring-1 ring-emerald-400/20">
              {p.result}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
