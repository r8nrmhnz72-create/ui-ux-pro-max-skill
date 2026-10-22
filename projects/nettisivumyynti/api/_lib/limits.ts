import { list, put } from "@vercel/blob";

const DAILY_TOTAL = Number(process.env.DEMO_DAILY_LIMIT ?? 30);
const PER_IP = 3;
const PER_EMAIL = 2;

async function hash(value: string): Promise<string> {
  const salt = process.env.DEMO_HASH_SALT ?? "sivuseppa";
  const data = new TextEncoder().encode(`${salt}:${value}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest).slice(0, 8), (b) => b.toString(16).padStart(2, "0")).join("");
}

export type LimitResult = { ok: true; marker: string } | { ok: false; error: string };

/**
 * Counts today's requests from small marker files in Blob storage.
 * Markers hold hashes only, never the email or IP itself.
 */
export async function checkAndRecord(ip: string, email: string, id: string): Promise<LimitResult> {
  const day = new Date().toISOString().slice(0, 10);
  const prefix = `limits/${day}/`;
  const [ipHash, emailHash] = await Promise.all([hash(`ip:${ip}`), hash(`email:${email}`)]);

  const { blobs } = await list({ prefix, limit: 1000 });
  const names = blobs.map((b) => b.pathname.slice(prefix.length));

  if (names.length >= DAILY_TOTAL) {
    return { ok: false, error: "Päivän demokiintiö on täynnä. Yritä huomenna uudelleen tai pyydä tarjous lomakkeella." };
  }
  if (names.filter((n) => n.startsWith(`ip-${ipHash}-`)).length >= PER_IP) {
    return { ok: false, error: "Olet tilannut jo useamman demon tänään. Yritä huomenna uudelleen." };
  }
  if (names.filter((n) => n.includes(`-em-${emailHash}-`)).length >= PER_EMAIL) {
    return { ok: false, error: "Tähän sähköpostiin on jo lähetetty demo tänään." };
  }

  const marker = `${prefix}ip-${ipHash}-em-${emailHash}-${id}.txt`;
  await put(marker, "1", { access: "private", addRandomSuffix: false, contentType: "text/plain" });
  return { ok: true, marker };
}
