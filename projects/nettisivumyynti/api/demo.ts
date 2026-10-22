import { get } from "@vercel/blob";

import { DEMO_CSP } from "./_lib/page.js";
import { DEMO_ID_RE } from "./_lib/validate.js";

function notFound(): Response {
  return new Response("<!doctype html><meta charset=utf-8><title>Demoa ei löytynyt</title><p style=\"font-family:system-ui;padding:24px\">Demoa ei löytynyt. Tarkista linkki.</p>", {
    status: 404,
    headers: { "content-type": "text/html; charset=utf-8", "content-security-policy": DEMO_CSP },
  });
}

export async function GET(request: Request): Promise<Response> {
  const id = new URL(request.url).searchParams.get("id") ?? "";
  if (!DEMO_ID_RE.test(id)) return notFound();

  const result = await get(`demos/${id}.html`, { access: "private" }).catch(() => null);
  if (!result || result.statusCode !== 200 || !result.stream) return notFound();

  return new Response(result.stream, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "content-security-policy": DEMO_CSP,
      "x-content-type-options": "nosniff",
      "referrer-policy": "no-referrer",
      "x-robots-tag": "noindex, nofollow",
      "cache-control": "private, max-age=300",
    },
  });
}
