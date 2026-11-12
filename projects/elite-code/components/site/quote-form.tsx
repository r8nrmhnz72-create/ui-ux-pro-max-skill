"use client";

import * as React from "react";
import { ArrowRight, CircleAlert, CircleCheck, Mail } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { site, templateLabel, templates } from "@/content/site";
import { EMPTY_QUOTE, normalizeQuote, QUOTE_LIMITS, quoteSummary, validateQuote, type QuoteErrors, type QuoteField } from "@/lib/quote";
import { useSelection } from "@/lib/selection";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "success" | "fallback" | "failure" | "busy";
type TextField = "name" | "company" | "email" | "phone" | "message";

const control =
  "w-full rounded-xl border border-input bg-background px-4 text-base text-foreground outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 aria-invalid:border-destructive motion-reduce:transition-none";

const fieldId = (name: string) => `tarjous-${name}`;

function Field({
  name,
  label,
  optional,
  error,
  hint,
  children,
}: {
  name: string;
  label: string;
  optional?: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={fieldId(name)} className="flex items-baseline justify-between gap-3 text-sm font-medium">
        <span>
          {label}
          {!optional && (
            <span aria-hidden="true" className="ml-1 text-highlight">
              *
            </span>
          )}
        </span>
        {optional && <span className="text-xs font-normal text-muted-foreground">{optional}</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${fieldId(name)}-ohje`} className="text-xs leading-relaxed text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${fieldId(name)}-virhe`} className="flex items-start gap-1.5 text-sm text-destructive">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/** `aria-describedby` for a control: its error while invalid, otherwise its hint. */
function describedBy(name: string, error?: string, hint?: string) {
  if (error) return `${fieldId(name)}-virhe`;
  return hint ? `${fieldId(name)}-ohje` : undefined;
}

export function QuoteForm() {
  const copy = site.quote;
  const { selectedId, select } = useSelection();
  const [values, setValues] = React.useState(EMPTY_QUOTE);
  const [errors, setErrors] = React.useState<QuoteErrors>({});
  const [status, setStatus] = React.useState<Status>("idle");
  const resultRef = React.useRef<HTMLDivElement>(null);

  const quote = normalizeQuote({ ...values, template: selectedId ?? "" });
  const mailto = `mailto:${site.contact.email}?subject=${encodeURIComponent(`${copy.mailSubject}: ${templateLabel(quote.template)}`)}&body=${encodeURIComponent(quoteSummary(quote, templateLabel(quote.template)))}`;

  React.useEffect(() => {
    if (status === "success" || status === "fallback") resultRef.current?.focus();
  }, [status]);

  const set = (name: TextField) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((old) => ({ ...old, [name]: event.target.value }));
    if (name in errors) setErrors((old) => ({ ...old, [name]: undefined }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    const found = validateQuote(quote);
    setErrors(found);
    const first = (Object.keys(found) as QuoteField[])[0];
    if (first) {
      document.getElementById(fieldId(first))?.focus();
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(quote),
      });
      if (response.ok) {
        setStatus("success");
        return;
      }
      if (response.status === 422) {
        const data = (await response.json().catch(() => null)) as { fields?: QuoteErrors } | null;
        setErrors(data?.fields ?? {});
        setStatus("idle");
        return;
      }
      // No form backend connected (501) or the site is hosted without the API route (404/405):
      // hand the finished message over to the visitor's own e-mail client instead.
      if ([501, 404, 405].includes(response.status)) {
        setStatus("fallback");
        window.location.href = mailto;
        return;
      }
      setStatus(response.status === 429 ? "busy" : "failure");
    } catch {
      setStatus("failure");
    }
  };

  const reset = () => {
    setValues(EMPTY_QUOTE);
    setErrors({});
    setStatus("idle");
  };

  if (status === "success" || status === "fallback") {
    const success = status === "success";
    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        role="status"
        className="flex flex-col items-start gap-5 rounded-3xl border border-border bg-card p-6 outline-none md:p-10"
      >
        {success ? (
          <CircleCheck aria-hidden="true" className="size-10 text-highlight" />
        ) : (
          <Mail aria-hidden="true" className="size-10 text-highlight" />
        )}
        <h3 className="text-2xl font-medium tracking-tight md:text-3xl">{success ? copy.success.title : copy.fallback.title}</h3>
        {success ? (
          <p className="max-w-md leading-relaxed text-muted-foreground">{copy.success.text}</p>
        ) : (
          <p className="max-w-md leading-relaxed text-muted-foreground">
            {copy.fallback.text}{" "}
            <a href={mailto} className="font-medium text-foreground underline underline-offset-4">
              {site.contact.email}
            </a>
            .
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-3">
          {!success && (
            <a href={mailto} className={buttonVariants()}>
              {copy.fallback.retry}
            </a>
          )}
          <Button variant="outline" onClick={reset}>
            {copy.success.again}
          </Button>
        </div>
      </div>
    );
  }

  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      aria-labelledby="tarjous-otsikko"
      className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-6 md:p-10"
    >
      <p className="text-xs text-muted-foreground">
        <span aria-hidden="true" className="mr-1 text-highlight">
          *
        </span>
        {copy.requiredNote}
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field name="name" label={copy.fields.name} error={errors.name}>
          <input
            id={fieldId("name")}
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={QUOTE_LIMITS.name}
            value={values.name}
            onChange={set("name")}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy("name", errors.name)}
            className={cn(control, "h-12")}
          />
        </Field>
        <Field name="company" label={copy.fields.company} optional={copy.fields.optional}>
          <input
            id={fieldId("company")}
            name="company"
            type="text"
            autoComplete="organization"
            maxLength={QUOTE_LIMITS.company}
            value={values.company}
            onChange={set("company")}
            className={cn(control, "h-12")}
          />
        </Field>
        <Field name="email" label={copy.fields.email} error={errors.email}>
          <input
            id={fieldId("email")}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            required
            maxLength={QUOTE_LIMITS.email}
            value={values.email}
            onChange={set("email")}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy("email", errors.email)}
            className={cn(control, "h-12")}
          />
        </Field>
        <Field name="phone" label={copy.fields.phone} optional={copy.fields.optional} error={errors.phone}>
          <input
            id={fieldId("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={QUOTE_LIMITS.phone}
            value={values.phone}
            onChange={set("phone")}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={describedBy("phone", errors.phone)}
            className={cn(control, "h-12")}
          />
        </Field>
      </div>

      <Field name="template" label={copy.fields.template} optional={copy.fields.optional}>
        <select
          id={fieldId("template")}
          name="template"
          value={selectedId ?? ""}
          onChange={(event) => select(event.target.value || null)}
          className={cn(control, "h-12 cursor-pointer appearance-none bg-[length:1rem] bg-[position:right_1rem_center] bg-no-repeat pr-11")}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%23888' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><path d='M4 6l4 4 4-4'/></svg>\")",
          }}
        >
          <option value="">{copy.fields.templateUndecided}</option>
          {templates.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} – {item.price}
            </option>
          ))}
        </select>
      </Field>

      <Field name="message" label={copy.fields.message} error={errors.message} hint={copy.fields.messageHint}>
        <textarea
          id={fieldId("message")}
          name="message"
          rows={5}
          required
          maxLength={QUOTE_LIMITS.message}
          value={values.message}
          onChange={set("message")}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describedBy("message", errors.message, copy.fields.messageHint)}
          className={cn(control, "min-h-32 resize-y py-3 leading-relaxed")}
        />
      </Field>

      {/* Honeypot: hidden from people, tempting for bots. */}
      <div hidden>
        <label>
          Verkkosivu
          <input
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={(event) => setValues((old) => ({ ...old, website: event.target.value }))}
          />
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-3">
          <input
            id={fieldId("consent")}
            name="consent"
            type="checkbox"
            required
            checked={values.consent}
            onChange={(event) => {
              setValues((old) => ({ ...old, consent: event.target.checked }));
              setErrors((old) => ({ ...old, consent: undefined }));
            }}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? `${fieldId("consent")}-virhe` : undefined}
            className="mt-0.5 size-5 shrink-0 cursor-pointer rounded accent-[var(--accent)] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          />
          <label htmlFor={fieldId("consent")} className="text-sm leading-relaxed text-muted-foreground">
            {copy.fields.consent}{" "}
            <a
              href={site.footer.privacy.href}
              target="_blank"
              rel="noopener"
              className="font-medium text-foreground underline underline-offset-4"
            >
              {copy.fields.consentLink}
              <span className="sr-only"> ({copy.fields.newTab})</span>
            </a>{" "}
            {copy.fields.consentTail}
            <span aria-hidden="true" className="ml-1 text-highlight">
              *
            </span>
          </label>
        </div>
        {errors.consent && (
          <p id={`${fieldId("consent")}-virhe`} className="flex items-start gap-1.5 text-sm text-destructive">
            <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            {errors.consent}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
        <Button type="submit" variant="accent" size="lg" disabled={status === "sending"} className="group">
          {status === "sending" ? copy.sending : copy.submit}
          <ArrowRight aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
        </Button>
        <div aria-live="polite" className="text-sm">
          {hasErrors && <p className="text-destructive">{copy.errorSummary}</p>}
          {(status === "failure" || status === "busy") && (
            <p className="text-destructive">
              {status === "busy" ? copy.busy : copy.failure}{" "}
              <a href={mailto} className="font-medium underline underline-offset-4">
                {site.contact.email}
              </a>
              .
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
