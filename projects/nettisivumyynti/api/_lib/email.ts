import { Resend } from "resend";

import type { DemoRequest } from "./validate.js";
import { escapeHtml } from "./validate.js";

function config() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.DEMO_FROM_EMAIL; // e.g. "Sivuseppä <demo@sivuseppa.fi>"
  const owner = process.env.OWNER_EMAIL;
  if (!apiKey || !from || !owner) throw new Error("RESEND_API_KEY, DEMO_FROM_EMAIL and OWNER_EMAIL must be set");
  return { resend: new Resend(apiKey), from, owner };
}

function layout(body: string): string {
  return `<div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1a0b54;line-height:1.55">${body}<p style="margin-top:32px;color:#83799e;font-size:13px">Sivuseppä · Nettisivut yrityksille</p></div>`;
}

function button(href: string, label: string): string {
  return `<p style="margin:28px 0"><a href="${escapeHtml(href)}" style="background:#1c4eff;color:#fff;padding:14px 22px;border-radius:12px;text-decoration:none;font-weight:600;display:inline-block">${escapeHtml(label)}</a></p>`;
}

export async function sendDemoEmail(req: DemoRequest, demoUrl: string, siteUrl: string): Promise<void> {
  const { resend, from, owner } = config();
  const firstName = req.name.split(/\s+/)[0];
  const { error } = await resend.emails.send({
    from,
    to: req.email,
    bcc: owner,
    replyTo: owner,
    subject: `Demosivustosi on valmis: ${req.company}`,
    html: layout(`
      <h1 style="font-size:24px;margin:0 0 16px">Hei ${escapeHtml(firstName)}!</h1>
      <p>Teimme toiveidesi pohjalta demosivuston yrityksellesi <strong>${escapeHtml(req.company)}</strong>.</p>
      ${button(demoUrl, "Avaa demosivusto")}
      <p>Demo on suuntaa antava luonnos. Oikeaan sivustoon tulevat sinun omat tekstisi, kuvasi ja yhteystietosi, ja muokkaamme ulkoasua, kunnes olet tyytyväinen.</p>
      <p>Haluatko jatkaa? Vastaa tähän viestiin tai <a href="${escapeHtml(siteUrl)}/#yhteys">pyydä tarjous</a>, niin palaamme asiaan arkipäivän sisällä.</p>`),
  });
  if (error) throw new Error(`Resend: ${error.message}`);
}

export async function sendFailureEmails(req: DemoRequest, reason: string): Promise<void> {
  const { resend, from, owner } = config();
  const firstName = req.name.split(/\s+/)[0];
  const results = await Promise.all([
    resend.emails.send({
      from,
      to: req.email,
      replyTo: owner,
      subject: "Demopyyntösi on vastaanotettu",
      html: layout(`
        <h1 style="font-size:24px;margin:0 0 16px">Hei ${escapeHtml(firstName)}!</h1>
        <p>Kiitos demopyynnöstä. Emme saaneet demoa valmiiksi automaattisesti, joten teemme sen käsin ja otamme sinuun yhteyttä arkipäivän sisällä.</p>`),
    }),
    resend.emails.send({
      from,
      to: owner,
      replyTo: req.email,
      subject: `Demon luonti epäonnistui: ${req.company}`,
      html: layout(`
        <h1 style="font-size:20px;margin:0 0 16px">Demon luonti epäonnistui</h1>
        <p><strong>Syy:</strong> ${escapeHtml(reason)}</p>
        <p><strong>Nimi:</strong> ${escapeHtml(req.name)}<br><strong>Sähköposti:</strong> ${escapeHtml(req.email)}<br><strong>Yritys:</strong> ${escapeHtml(req.company)}<br><strong>Toimiala:</strong> ${escapeHtml(req.industry || "-")}</p>
        <p><strong>Toiveet:</strong><br>${escapeHtml(req.description).replace(/\n/g, "<br>")}</p>`),
    }),
  ]);
  const failed = results.find((r) => r.error);
  if (failed?.error) throw new Error(`Resend: ${failed.error.message}`);
}
