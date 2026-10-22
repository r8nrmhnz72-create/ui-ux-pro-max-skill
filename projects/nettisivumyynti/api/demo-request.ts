import { put } from "@vercel/blob";
import { waitUntil } from "@vercel/functions";

import { sendDemoEmail, sendFailureEmails } from "./_lib/email.js";
import { generateDemo } from "./_lib/generate.js";
import { checkAndRecord } from "./_lib/limits.js";
import { addDemoRibbon } from "./_lib/page.js";
import { newDemoId, validateDemoRequest, type DemoRequest } from "./_lib/validate.js";

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

async function buildAndSend(req: DemoRequest, id: string, siteUrl: string): Promise<void> {
  const started = Date.now();
  const result = await generateDemo(req);

  if (!result.ok) {
    console.error(`[demo ${id}] generation failed: ${result.reason}`);
    await sendFailureEmails(req, result.reason).catch((e) => console.error(`[demo ${id}] failure email failed`, e));
    return;
  }

  try {
    await put(`demos/${id}.html`, addDemoRibbon(result.html, siteUrl), {
      access: "private",
      addRandomSuffix: false,
      contentType: "text/html; charset=utf-8",
    });
    await sendDemoEmail(req, `${siteUrl}/demo/${id}`, siteUrl);
    console.log(
      `[demo ${id}] sent in ${Math.round((Date.now() - started) / 1000)}s, tokens in=${result.inputTokens} out=${result.outputTokens}`,
    );
  } catch (error) {
    console.error(`[demo ${id}] store or email failed`, error);
    await sendFailureEmails(req, `tallennus tai sähköposti epäonnistui: ${String(error)}`).catch(() => {});
  }
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(400, { ok: false, error: "Virheellinen pyyntö." });
  }

  const v = validateDemoRequest(body);
  if (!v.ok) {
    // Pretend success to bots so they don't learn about the honeypot.
    return v.spam ? json(202, { ok: true }) : json(400, { ok: false, error: v.error });
  }

  const ip = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const id = newDemoId();

  let limit;
  try {
    limit = await checkAndRecord(ip, v.data.email, id);
  } catch (error) {
    console.error("[demo] limit check failed", error);
    return json(503, { ok: false, error: "Palvelu ei ole juuri nyt käytettävissä. Yritä hetken päästä uudelleen." });
  }
  if (!limit.ok) return json(429, { ok: false, error: limit.error });

  const siteUrl = (process.env.SITE_URL ?? new URL(request.url).origin).replace(/\/$/, "");

  // Answer right away; the demo is built and emailed in the background.
  waitUntil(buildAndSend(v.data, id, siteUrl));
  return json(202, { ok: true });
}
