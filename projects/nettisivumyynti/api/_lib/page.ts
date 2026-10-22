import { escapeHtml } from "./validate.js";

/**
 * Served on every demo page. The sandbox puts the page in a unique origin
 * with scripts disabled, so generated markup can never run code on our domain.
 */
export const DEMO_CSP = [
  "sandbox allow-popups allow-popups-to-escape-sandbox",
  "default-src 'none'",
  "style-src 'unsafe-inline' https://fonts.googleapis.com",
  "font-src https://fonts.gstatic.com",
  "img-src data:",
  "form-action 'none'",
  "base-uri 'none'",
  "frame-ancestors 'none'",
].join("; ");

/** Adds a small fixed ribbon so nobody mistakes the demo for a live site. */
export function addDemoRibbon(html: string, siteUrl: string): string {
  const ribbon = `<div style="position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:2147483647;display:flex;gap:10px;align-items:center;padding:10px 16px;border-radius:999px;background:#1a0b54;color:#fff;font:500 14px/1.2 system-ui,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.25);max-width:calc(100% - 32px)">Demo · tehnyt Sivuseppä<a href="${escapeHtml(siteUrl)}/#yhteys" target="_blank" rel="noopener" style="color:#1a0b54;background:#fff;border-radius:999px;padding:6px 12px;text-decoration:none;white-space:nowrap">Tilaa oikea sivusto</a></div>`;
  const i = html.toLowerCase().lastIndexOf("</body>");
  return i === -1 ? html + ribbon : html.slice(0, i) + ribbon + html.slice(i);
}
