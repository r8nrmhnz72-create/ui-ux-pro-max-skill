import { normalizeQuote, quoteSummary, validateQuote } from "@/lib/quote";
import { templateLabel } from "@/content/site";

/**
 * Receives a quote request from the form and forwards it as JSON to QUOTE_FORM_ENDPOINT
 * (any form backend that accepts a JSON POST: Formspree, Make, Zapier, your own API…).
 *
 * Without the variable the route answers 501 and the form falls back to opening the
 * visitor's e-mail client, so the site works before any backend is connected.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>();

/**
 * Best-effort flood guard: at most five requests per address in ten minutes.
 * It lives in this server instance's memory, so on serverless hosting it only slows
 * a burst down; put real rate limiting in front of the form backend if you need it.
 */
function tooMany(request: Request): boolean {
  const address = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const hits = (recent.get(address) ?? []).filter((time) => now - time < WINDOW_MS);
  hits.push(now);
  recent.set(address, hits);
  if (recent.size > 5000) recent.clear();
  return hits.length > MAX_PER_WINDOW;
}

/** Browsers send Origin on POST; a request from another site is not our form. */
function crossSite(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const hosts = [request.headers.get("x-forwarded-host"), request.headers.get("host")].filter(Boolean);
  try {
    return !hosts.includes(new URL(origin).host);
  } catch {
    return true;
  }
}

export async function POST(request: Request) {
  if (crossSite(request)) {
    return Response.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  if (tooMany(request)) {
    return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const quote = normalizeQuote(body);
  const errors = validateQuote(quote);
  if (Object.keys(errors).length > 0) {
    return Response.json({ ok: false, error: "invalid", fields: errors }, { status: 422 });
  }

  // Bots fill the hidden field. Answer as if it worked and drop the message.
  if (quote.website) return Response.json({ ok: true });

  const endpoint = process.env.QUOTE_FORM_ENDPOINT;
  if (!endpoint) {
    return Response.json({ ok: false, error: "not_configured" }, { status: 501 });
  }

  const label = templateLabel(quote.template);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name: quote.name,
        email: quote.email,
        phone: quote.phone,
        company: quote.company,
        template: label,
        message: quote.message,
        _subject: `Tarjouspyyntö: ${label} – ${quote.name}`,
        summary: quoteSummary(quote, label),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      return Response.json({ ok: false, error: "upstream" }, { status: 502 });
    }
  } catch {
    return Response.json({ ok: false, error: "upstream" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
