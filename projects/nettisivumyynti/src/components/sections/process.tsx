import { SectionHeading } from "./section-heading";

const steps = [
  { title: "Maksuton kartoitus", text: "30 minuutin puhelu, jossa käymme läpi tavoitteesi, kohderyhmän ja budjetin." },
  { title: "Suunnittelu", text: "Saat ulkoasuluonnoksen kommentoitavaksi. Muokkaamme, kunnes olet tyytyväinen." },
  { title: "Rakennus", text: "Toteutamme sivuston, lisäämme sisällöt ja testaamme kaikilla laitteilla." },
  { title: "Julkaisu ja tuki", text: "Sivusto julki, koulutus sisällönhallintaan ja 30 päivän takuu mukaan." },
];

export function Process() {
  return (
    <section id="prosessi" className="scroll-mt-8 bg-[var(--bg-100)]/50 px-6 py-24 sm:py-32">
      <SectionHeading eyebrow="Prosessi" title="Ideasta valmiiseen sivustoon" description="Neljä selkeää vaihetta. Tiedät aina, missä mennään." />
      <ol className="mx-auto mt-14 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.title} className="rounded-3xl bg-[var(--bg-100)] p-7 ring-1 ring-white/10">
            <span className="font-instrument-serif text-4xl text-[var(--text-400)]">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-4 text-lg font-semibold text-white">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-300)]">{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
