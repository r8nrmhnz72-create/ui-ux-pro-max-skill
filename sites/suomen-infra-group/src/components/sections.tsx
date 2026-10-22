import { ArrowRight, Check, Shovel, Users } from "lucide-react"

function SectionHead({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-9 flex max-w-[46em] flex-col gap-2.5">
      <p className="font-display text-[13px] font-bold uppercase tracking-[0.12em] text-primary-strong">{eyebrow}</p>
      <h2 className="text-[clamp(28px,4vw,42px)] font-bold leading-tight tracking-tight">{title}</h2>
      {children ? <p className="text-muted-foreground">{children}</p> : null}
    </div>
  )
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-baseline gap-2.5">
      <span className="size-2 shrink-0 -translate-y-0.5 bg-primary" aria-hidden="true" />
      {children}
    </li>
  )
}

export function Services() {
  const cards = [
    {
      icon: Users,
      title: "Henkilöstövuokraus",
      text: "Ammattitaitoiset työntekijät rakennus- ja infratyömaille lyhyisiin ja pitkiin tarpeisiin. Me hoidamme rekrytoinnin, palkanmaksun ja työnantajavelvoitteet.",
      bullets: ["Nopea reagointi lisätarpeisiin", "Yksittäisistä tekijöistä kokonaisiin työryhmiin", "Tilaajavastuulain mukaiset selvitykset"],
      link: { label: "Lue lisää henkilöstövuokrauksesta", href: "#henkilostovuokraus" },
    },
    {
      icon: Shovel,
      title: "Infrarakentaminen",
      text: "Toteutamme maa- ja infrarakentamisen töitä yrityksille, kunnille ja rakennusliikkeille. Työ tehdään suunnitelmien, aikataulun ja turvallisuusmääräysten mukaan.",
      bullets: ["Maanrakennus ja kaivutyöt", "Kunnallistekniikka ja putkityöt", "Piha-, katu- ja tietyöt"],
      link: { label: "Pyydä tarjous kohteeseesi", href: "#tarjouspyynto" },
    },
  ]
  return (
    <section id="palvelut" className="py-14 md:py-18">
      <div className="wrap">
        <SectionHead eyebrow="Palvelut" title="Kaksi tapaa saada työt valmiiksi">
          Tarvitsetko lisäkäsiä omaan urakkaasi vai tekijän koko kohteelle? Hoidamme kumman tahansa.
        </SectionHead>
        <div className="grid gap-5 md:grid-cols-2">
          {cards.map(({ icon: Icon, ...c }) => (
            <article key={c.title} className="flex min-w-0 flex-col gap-3.5 rounded-md border bg-card p-7 text-card-foreground">
              <Icon className="size-11 text-primary-strong" strokeWidth={1.8} aria-hidden="true" />
              <h3 className="text-[26px] font-bold leading-tight">{c.title}</h3>
              <p className="text-muted-foreground">{c.text}</p>
              <ul className="grid gap-2">
                {c.bullets.map((b) => (
                  <Bullet key={b}>{b}</Bullet>
                ))}
              </ul>
              <a
                href={c.link.href}
                className="mt-auto inline-flex min-h-11 items-center gap-1.5 font-display font-semibold text-primary-strong hover:underline"
              >
                {c.link.label}
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

const ROLES = [
  "Maanrakentajat",
  "Koneenkuljettajat",
  "Putkiasentajat",
  "Kirvesmiehet",
  "Raudoittajat",
  "Betonityöntekijät",
  "Työmaa-apulaiset",
  "Työnjohto",
]

const STEPS = [
  { title: "Kerro tarpeesi", text: "Täytä tarjouspyyntö: ammattiryhmä, henkilömäärä, aloitus ja työmaan sijainti." },
  { title: "Saat ehdotuksen", text: "Otamme yhteyttä, tarkennamme tarpeen ja ehdotamme sopivat tekijät." },
  { title: "Työt alkavat", text: "Tekijät saapuvat työmaalle sovittuna päivänä. Lisätarpeet hoituvat saman yhteyshenkilön kautta." },
]

export function Staffing() {
  return (
    <section id="henkilostovuokraus" className="bg-muted py-14 md:py-18">
      <div className="wrap grid items-start gap-10 md:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-5">
          <div className="-mb-4">
            <SectionHead eyebrow="Henkilöstövuokraus" title="Oikea ammattilainen oikeaan vaiheeseen">
              Vuokratyöntekijä tulee työmaallesi valmiina töihin. Sinä johdat työtä, me hoidamme työnantajan velvollisuudet.
            </SectionHead>
          </div>
          <p className="text-[15px] font-semibold">Ammattiryhmät</p>
          <ul className="flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <li key={r} className="whitespace-nowrap rounded-full border bg-card px-3.5 py-1.5 text-[15px] font-semibold">
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex min-w-0 flex-col gap-5">
          <h3 className="text-[22px] font-bold">Näin se toimii</h3>
          <ol className="grid gap-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[44px_minmax(0,1fr)] items-start gap-3.5">
                <span className="grid size-11 place-items-center rounded-md bg-band font-display text-lg font-extrabold text-band-foreground">
                  {i + 1}
                </span>
                <div>
                  <h4 className="font-display text-[19px] font-bold">{s.title}</h4>
                  <p className="text-muted-foreground">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

export function Facts() {
  const facts = [
    ["Palvelut", "Henkilöstövuokraus · Infra"],
    ["Asiakkaat", "Rakennus- ja infraurakoitsijat"],
    ["Toiminta-alue", "[TOIMINTA-ALUE]"],
    ["Y-tunnus", "[Y-TUNNUS]"],
  ]
  return (
    <div className="border-b-[6px] border-primary bg-band text-band-foreground">
      <dl className="wrap grid gap-x-8 py-2 sm:grid-cols-2 lg:grid-cols-4">
        {facts.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-4 border-b border-white/15 py-3.5 lg:flex-col lg:gap-0.5 lg:border-b-0">
            <dt className="text-band-muted">{k}</dt>
            <dd className="text-right font-display font-bold lg:text-left">
              <Check className="mr-1.5 hidden size-4 text-primary lg:inline" aria-hidden="true" />
              {v}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="bg-band text-[15px] text-band-muted">
      <div className="wrap flex flex-wrap justify-between gap-4 py-8">
        <div>
          <strong className="font-display text-band-foreground">Suomen Infra Group Oy</strong>
          <br />
          Y-tunnus [Y-TUNNUS]
          <br />
          [KÄYNTIOSOITE]
        </div>
        <div>
          Puhelin [PUHELIN]
          <br />
          Sähköposti [SÄHKÖPOSTI]
        </div>
        <div>© {new Date().getFullYear()} Suomen Infra Group Oy</div>
      </div>
    </footer>
  )
}
