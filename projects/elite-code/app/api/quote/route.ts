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
const MAX_TRACKED = 5000;
const MAX_BODY_BYTES = 32 * 1024;
const recent = new Map<string, number[]>();

/**
 * The address to count requests against. `x-real-ip` is set by the hosting platform or reverse
 * proxy; of `x-forwarded-for` only the last entry (appended by the nearest proxy) is used,
 * because everything before it can be written by the client. If the app is exposed directly,
 * with no proxy in front, neither header can be trusted: rate-limit at the edge instead.
 */
function clientAddress(request: Request): string {
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real;
  const forwarded = request.headers
    .get("x-forwarded-for")
    ?.split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  return forwarded?.at(-1) ?? "unknown";
}

/**
 * Best-effort flood guard: at most five requests per address in ten minutes.
 * It lives in this server instance's memory, so on serverless hosting it only slows
 * a burst down; put real rate limiting in front of the form backend if you need it.
 */
function tooMany(request: Request): boolean {
  const address = clientAddress(request);
  const now = Date.now();
  const hits = (recent.get(address) ?? []).filter((time) => now - time < WINDOW_MS);
  const blocked = hits.length >= MAX_PER_WINDOW;
  if (!blocked) hits.push(now);
  // Re-insert so the map stays ordered by last activity; the first key is then the stalest.
  recent.delete(address);
  recent.set(address, hits);
  if (recent.size > MAX_TRACKED) {
    const stalest = recent.keys().next().value;
    if (stalest !== undefined) recent.delete(stalest);
  }
  return blocked;
}

/** Reads the body as text and gives up as soon as it grows past the cap (a real request is a few kB). */
async function readBody(request: Request): Promise<string | null> {
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return null;
  const reader = request.body?.getReader();
  if (!reader) return "";
  const decoder = new TextDecoder();
  let size = 0;
  let text = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    text += decoder.decode(value, { stream: true });
  }
  return text + decoder.decode();
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

  const raw = await readBody(request);
  if (raw === null) {
    return Response.json({ ok: false, error: "too_large" }, { status: 413 });
  }
  let body: unknown;
  try {
    body = JSON.parse(raw);
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
