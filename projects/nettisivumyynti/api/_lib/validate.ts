export interface DemoRequest {
  name: string;
  email: string;
  company: string;
  industry: string;
  description: string;
}

export type ValidationResult =
  | { ok: true; data: DemoRequest }
  | { ok: false; error: string; spam?: boolean };

const LIMITS = { name: 100, email: 200, company: 120, industry: 120, description: 2000 };
const EMAIL_RE = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[a-z]{2,}$/i;

function str(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  // Drop control characters except newlines and tabs.
  return v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);
}

export function validateDemoRequest(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") return { ok: false, error: "Virheellinen pyyntö." };
  const b = body as Record<string, unknown>;

  // Honeypot: real visitors never see or fill this field.
  if (typeof b.website === "string" && b.website.trim() !== "") {
    return { ok: false, error: "Virheellinen pyyntö.", spam: true };
  }

  const data: DemoRequest = {
    name: str(b.name, LIMITS.name),
    email: str(b.email, LIMITS.email).toLowerCase(),
    company: str(b.company, LIMITS.company),
    industry: str(b.industry, LIMITS.industry),
    description: str(b.description, LIMITS.description),
  };

  if (!data.name) return { ok: false, error: "Kerro nimesi." };
  if (!EMAIL_RE.test(data.email)) return { ok: false, error: "Tarkista sähköpostiosoite." };
  if (!data.company) return { ok: false, error: "Kerro yrityksen nimi." };
  if (data.description.length < 20) {
    return { ok: false, error: "Kuvaile toiveitasi vähän tarkemmin (vähintään 20 merkkiä)." };
  }
  if (b.consent !== true) return { ok: false, error: "Hyväksy tietojen käsittely." };

  return { ok: true, data };
}

export const DEMO_ID_RE = /^[a-z0-9]{12}$/;

export function newDemoId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const abc = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(bytes, (x) => abc[x % abc.length]).join("");
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
