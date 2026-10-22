import { useRef, useState } from "react"

import { cn } from "@/lib/utils"

/**
 * Address that receives quote requests. When set, submissions are sent
 * through FormSubmit (https://formsubmit.co) straight to this inbox.
 * Can also be set at build time: VITE_FORM_EMAIL=you@company.fi npm run build
 */
const FORM_EMAIL: string = import.meta.env.VITE_FORM_EMAIL ?? ""

type Status = { kind: "ok" | "error" | "info"; text: string } | null

const REQUIRED: Record<string, string> = {
  Yritys: "Kirjoita yrityksen nimi.",
  Yhteyshenkilö: "Kirjoita yhteyshenkilön nimi.",
  email: "Kirjoita sähköposti muodossa nimi@yritys.fi.",
  Puhelin: "Kirjoita puhelinnumero.",
  Ammattiryhmä: "Valitse ammattiryhmä.",
  Henkilömäärä: "Kirjoita henkilömäärä väliltä 1–200.",
  Paikkakunta: "Kirjoita työmaan paikkakunta.",
}

const ROLES = [
  "Maanrakentaja",
  "Koneenkuljettaja",
  "Putkiasentaja",
  "Kirvesmies",
  "Raudoittaja",
  "Betonityöntekijä",
  "Työmaa-apulainen",
  "Työnjohto",
  "Muu (kerro lisätiedoissa)",
]
const LENGTHS = ["Alle 2 viikkoa", "2–8 viikkoa", "2–6 kuukautta", "Yli 6 kuukautta", "Ei vielä tiedossa"]
const CARDS = ["Työturvallisuuskortti", "Tieturva 1", "Tieturva 2", "Tulityökortti", "Ajokortti"]

const inputCls =
  "w-full min-h-12 rounded-sm border border-input bg-background px-3 py-2.5 text-base text-foreground aria-[invalid=true]:border-2 aria-[invalid=true]:border-destructive-foreground"

function Field({
  id,
  label,
  required,
  error,
  className,
  children,
}: {
  id: string
  label: string
  required?: boolean
  error?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-[15px] font-semibold">
        {label}
        {required ? (
          <span className="text-primary-strong" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <span id={`${id}-err`} className="text-sm font-semibold text-destructive-foreground">
          {error}
        </span>
      ) : null}
    </div>
  )
}

export function QuoteForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Status>(null)
  const [sending, setSending] = useState(false)

  function check(el: HTMLInputElement | HTMLSelectElement) {
    const msg = REQUIRED[el.name]
    if (!msg) return ""
    return !el.checkValidity() || el.value.trim() === "" ? msg : ""
  }

  function onBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    const el = e.currentTarget
    if (errors[el.name] || el.value) setErrors((prev) => ({ ...prev, [el.name]: check(el) }))
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setStatus(null)

    const next: Record<string, string> = {}
    let first: HTMLElement | null = null
    for (const name of Object.keys(REQUIRED)) {
      const el = form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement
      const msg = check(el)
      if (msg) {
        next[name] = msg
        first ??= el
      }
    }
    setErrors(next)
    if (first) {
      first.focus()
      setStatus({ kind: "error", text: "Tarkista punaisella merkityt kentät." })
      return
    }

    const fd = new FormData(form)
    if (fd.get("_honey")) return

    if (!FORM_EMAIL) {
      setStatus({
        kind: "info",
        text: "Tämä on esikatseluversio: lomake toimii, mutta viestin lähetys otetaan käyttöön, kun vastaanottajan sähköposti on asetettu.",
      })
      return
    }

    const data: Record<string, string> = {}
    fd.forEach((v, k) => {
      if (k === "_honey") return
      data[k] = data[k] ? `${data[k]}, ${v}` : String(v)
    })

    setSending(true)
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(FORM_EMAIL)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      })
      const body = await res.json()
      if (!res.ok || String(body.success) !== "true") throw new Error("send failed")
      form.reset()
      setStatus({ kind: "ok", text: "Kiitos! Tarjouspyyntösi on lähetetty. Otamme sinuun yhteyttä pian." })
    } catch {
      setStatus({ kind: "error", text: "Lähetys ei onnistunut. Yritä hetken päästä uudelleen tai soita meille." })
    } finally {
      setSending(false)
    }
  }

  const a11y = (name: string) =>
    errors[name] ? { "aria-invalid": true as const, "aria-describedby": `f-${name}-err` } : {}

  return (
    <section id="tarjouspyynto" className="py-14 md:py-18">
      <div className="wrap">
        <div className="mb-9 flex max-w-[46em] flex-col gap-2.5">
          <p className="font-display text-[13px] font-bold uppercase tracking-[0.12em] text-primary-strong">Tarjouspyyntö</p>
          <h2 className="text-[clamp(28px,4vw,42px)] font-bold leading-tight tracking-tight">Tarvitsetko työntekijöitä?</h2>
          <p className="text-muted-foreground">
            Täytä lomake, niin pyyntösi tulee suoraan sähköpostiimme. Vastaamme mahdollisimman pian.
          </p>
        </div>

        <div className="rounded-md border border-t-[6px] border-t-primary bg-card p-[clamp(20px,4vw,40px)] text-card-foreground">
          <form ref={formRef} noValidate onSubmit={onSubmit} className="grid gap-6">
            <input type="hidden" name="_subject" value="Uusi henkilöstövuokrauspyyntö – Suomen Infra Group" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_captcha" value="false" />
            <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="f-honey">Älä täytä tätä</label>
              <input id="f-honey" type="text" name="_honey" tabIndex={-1} autoComplete="off" />
            </div>

            <fieldset className="grid min-w-0 gap-4">
              <legend className="mb-3 font-display text-xl font-bold">Yhteystiedot</legend>
              <div className="grid gap-4 md:grid-cols-2">
                <Field id="f-Yritys" label="Yritys" required error={errors.Yritys}>
                  <input id="f-Yritys" name="Yritys" required autoComplete="organization" className={inputCls} onBlur={onBlur} {...a11y("Yritys")} />
                </Field>
                <Field id="f-Yhteyshenkilö" label="Yhteyshenkilö" required error={errors.Yhteyshenkilö}>
                  <input id="f-Yhteyshenkilö" name="Yhteyshenkilö" required autoComplete="name" className={inputCls} onBlur={onBlur} {...a11y("Yhteyshenkilö")} />
                </Field>
                <Field id="f-email" label="Sähköposti" required error={errors.email}>
                  <input id="f-email" name="email" type="email" inputMode="email" required autoComplete="email" className={inputCls} onBlur={onBlur} {...a11y("email")} />
                </Field>
                <Field id="f-Puhelin" label="Puhelin" required error={errors.Puhelin}>
                  <input id="f-Puhelin" name="Puhelin" type="tel" inputMode="tel" required autoComplete="tel" className={inputCls} onBlur={onBlur} {...a11y("Puhelin")} />
                </Field>
              </div>
            </fieldset>

            <fieldset className="grid min-w-0 gap-4">
              <legend className="mb-3 font-display text-xl font-bold">Työvoiman tarve</legend>
              <div className="grid gap-4 md:grid-cols-2">
                <Field id="f-Ammattiryhmä" label="Ammattiryhmä" required error={errors.Ammattiryhmä}>
                  <select id="f-Ammattiryhmä" name="Ammattiryhmä" required defaultValue="" className={inputCls} onBlur={onBlur} {...a11y("Ammattiryhmä")}>
                    <option value="">Valitse</option>
                    {ROLES.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </Field>
                <Field id="f-Henkilömäärä" label="Henkilömäärä" required error={errors.Henkilömäärä}>
                  <input id="f-Henkilömäärä" name="Henkilömäärä" type="number" min={1} max={200} defaultValue={1} required inputMode="numeric" className={inputCls} onBlur={onBlur} {...a11y("Henkilömäärä")} />
                </Field>
                <Field id="f-Aloituspäivä" label="Toivottu aloituspäivä">
                  <input id="f-Aloituspäivä" name="Aloituspäivä" type="date" className={inputCls} />
                </Field>
                <Field id="f-Kesto" label="Arvioitu kesto">
                  <select id="f-Kesto" name="Kesto" defaultValue="" className={inputCls}>
                    <option value="">Valitse</option>
                    {LENGTHS.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </Field>
                <Field id="f-Paikkakunta" label="Työmaan paikkakunta" required error={errors.Paikkakunta} className="md:col-span-2">
                  <input id="f-Paikkakunta" name="Paikkakunta" required autoComplete="address-level2" className={inputCls} onBlur={onBlur} {...a11y("Paikkakunta")} />
                </Field>
              </div>

              <div role="group" aria-labelledby="f-cards-label" className="flex flex-col gap-1.5">
                <span id="f-cards-label" className="text-[15px] font-semibold">
                  Vaaditut pätevyydet
                </span>
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {CARDS.map((c) => (
                    <label key={c} className="flex min-h-11 cursor-pointer items-center gap-2">
                      <input type="checkbox" name="Pätevyydet" value={c} className="size-5 accent-primary" />
                      {c}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="f-Lisätiedot" className="text-[15px] font-semibold">
                  Lisätiedot
                </label>
                <textarea id="f-Lisätiedot" name="Lisätiedot" aria-describedby="f-Lisätiedot-hint" className={cn(inputCls, "min-h-30 resize-y")} />
                <span id="f-Lisätiedot-hint" className="text-sm text-muted-foreground">
                  Esimerkiksi työtehtävät, työajat ja muut toiveet.
                </span>
              </div>
            </fieldset>

            <div role="status" aria-live="polite">
              {status ? (
                <p
                  className={cn(
                    "rounded-sm px-4 py-3.5 font-semibold",
                    status.kind === "ok" && "bg-success text-success-foreground",
                    status.kind === "error" && "bg-destructive text-destructive-foreground",
                    status.kind === "info" && "bg-info text-info-foreground",
                  )}
                >
                  {status.text}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={sending}
                className="inline-flex min-h-12 cursor-pointer items-center rounded-sm bg-primary px-6 font-display font-bold text-primary-foreground transition-colors duration-200 hover:bg-primary-strong hover:text-white disabled:cursor-progress disabled:opacity-70"
              >
                {sending ? "Lähetetään…" : "Lähetä tarjouspyyntö"}
              </button>
              <p className="flex-[1_1_260px] text-sm text-muted-foreground">* pakollinen tieto. Käytämme tietoja vain yhteydenottoa varten.</p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
