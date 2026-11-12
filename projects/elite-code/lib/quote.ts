/** Quote request: one shape and one validator shared by the form (client) and the API route (server). */

export interface QuoteRequest {
  name: string;
  email: string;
  phone: string;
  company: string;
  /** Template id picked from the belt, or "" when the visitor hasn't decided. */
  template: string;
  message: string;
  consent: boolean;
  /** Honeypot: real visitors never see or fill this field. */
  website: string;
}

export type QuoteField = "name" | "email" | "phone" | "message" | "consent";
export type QuoteErrors = Partial<Record<QuoteField, string>>;

export const QUOTE_LIMITS = { name: 120, email: 254, phone: 40, company: 160, template: 60, message: 4000 } as const;

export const EMPTY_QUOTE: QuoteRequest = {
  name: "",
  email: "",
  phone: "",
  company: "",
  template: "",
  message: "",
  consent: false,
  website: "",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[\d\s()-]{5,}$/;

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** Coerces untrusted input (form state or a JSON body) into a QuoteRequest with trimmed, length-capped strings. */
export function normalizeQuote(input: unknown): QuoteRequest {
  const source = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  return {
    name: text(source.name, QUOTE_LIMITS.name),
    email: text(source.email, QUOTE_LIMITS.email),
    phone: text(source.phone, QUOTE_LIMITS.phone),
    company: text(source.company, QUOTE_LIMITS.company),
    template: text(source.template, QUOTE_LIMITS.template),
    message: text(source.message, QUOTE_LIMITS.message),
    consent: source.consent === true,
    website: text(source.website, 200),
  };
}

/** Returns Finnish, field-level error messages; an empty object means the request is valid. */
export function validateQuote(quote: QuoteRequest): QuoteErrors {
  const errors: QuoteErrors = {};
  if (quote.name.length < 2) errors.name = "Kerro nimesi, niin tiedämme kenelle vastaamme.";
  if (!EMAIL.test(quote.email)) errors.email = "Tarkista sähköpostiosoite, esimerkiksi nimi@yritys.fi.";
  if (quote.phone && !PHONE.test(quote.phone)) errors.phone = "Tarkista puhelinnumero tai jätä kenttä tyhjäksi.";
  if (quote.message.length < 10) errors.message = "Kuvaile tarvettasi parilla lauseella.";
  if (!quote.consent) errors.consent = "Tarvitsemme suostumuksesi, jotta voimme vastata pyyntöösi.";
  return errors;
}

/** Plain-text summary used for the e-mail fallback and for the forwarded payload. */
export function quoteSummary(quote: QuoteRequest, templateLabel: string): string {
  const lines = [`Nimi: ${quote.name}`];
  if (quote.company) lines.push(`Yritys: ${quote.company}`);
  lines.push(`Sähköposti: ${quote.email}`);
  if (quote.phone) lines.push(`Puhelin: ${quote.phone}`);
  lines.push(`Sivumalli: ${templateLabel}`, "", quote.message);
  return lines.join("\n");
}
