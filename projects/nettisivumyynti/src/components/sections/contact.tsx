import { useState, type FormEvent } from "react";
import { CheckCircle2, Mail, Phone } from "lucide-react";

const inputClass =
  "mt-2 w-full rounded-xl bg-[var(--bg-0)] px-4 py-3 text-base text-white ring-1 ring-white/15 placeholder:text-[var(--text-400)] focus:outline-none focus:ring-2 focus:ring-white";

export function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Hook up to your backend / form service (e.g. Formspree) here.
    setSent(true);
  }

  return (
    <section id="yhteys" className="scroll-mt-8 px-6 pb-24 sm:pb-32">
      <div className="mx-auto grid max-w-6xl gap-10 rounded-[2rem] bg-[var(--bg-100)] p-8 ring-1 ring-white/10 sm:p-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium tracking-wide text-[var(--text-300)] uppercase">Yhteydenotto</p>
          <h2 className="mt-3 font-instrument-serif text-4xl leading-tight tracking-tight text-white sm:text-5xl">
            Pyydä ilmainen tarjous
          </h2>
          <p className="mt-4 text-[var(--text-300)]">
            Kerro lyhyesti yrityksestäsi ja tarpeistasi. Vastaamme yhden arkipäivän sisällä – tarjous ei sido sinua mihinkään.
          </p>
          <ul className="mt-8 space-y-4 text-[var(--text-200)]">
            <li>
              <a href="tel:+358401234567" className="inline-flex items-center gap-3 hover:text-white">
                <Phone className="h-5 w-5" aria-hidden /> 040 123 4567
              </a>
            </li>
            <li>
              <a href="mailto:moi@sivuseppa.fi" className="inline-flex items-center gap-3 hover:text-white">
                <Mail className="h-5 w-5" aria-hidden /> moi@sivuseppa.fi
              </a>
            </li>
          </ul>
        </div>

        {sent ? (
          <div role="status" className="flex flex-col items-center justify-center rounded-3xl bg-[var(--bg-0)] p-10 text-center ring-1 ring-white/10">
            <CheckCircle2 className="h-12 w-12 text-emerald-400" aria-hidden />
            <h3 className="mt-4 text-xl font-semibold text-white">Kiitos viestistäsi!</h3>
            <p className="mt-2 text-[var(--text-300)]">Otamme sinuun yhteyttä yhden arkipäivän sisällä.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-medium text-[var(--text-200)]">
                Nimi
                <input name="name" required autoComplete="name" className={inputClass} placeholder="Matti Meikäläinen" />
              </label>
              <label className="text-sm font-medium text-[var(--text-200)]">
                Sähköposti
                <input name="email" type="email" required autoComplete="email" className={inputClass} placeholder="matti@yritys.fi" />
              </label>
            </div>
            <label className="text-sm font-medium text-[var(--text-200)]">
              Paketti
              <select name="plan" className={inputClass} defaultValue="Yritys">
                <option>Startti</option>
                <option>Yritys</option>
                <option>Verkkokauppa</option>
                <option>En tiedä vielä</option>
              </select>
            </label>
            <label className="text-sm font-medium text-[var(--text-200)]">
              Viesti
              <textarea name="message" rows={4} className={inputClass} placeholder="Kerro yrityksestäsi ja millaisen sivuston haluat." />
            </label>
            <button
              type="submit"
              className="rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-white/90"
            >
              Lähetä tarjouspyyntö
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
