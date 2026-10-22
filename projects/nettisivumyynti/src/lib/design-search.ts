// A small TypeScript port of the UI UX Pro Max search (BM25 over the same
// CSV data, exported to design-data.ts). Used as a Claude tool both by the
// Vercel function and by the in-page preview, so every demo is designed with
// the same database and workflow.
import data from "./design-data.js";

export type DesignDomain = "product" | "style" | "color" | "typography" | "landing" | "ux";
export const DESIGN_DOMAINS: DesignDomain[] = ["product", "style", "color", "typography", "landing", "ux"];

export interface DesignTable {
  description: string;
  search: string[];
  rows: Record<string, string>[];
}
export type DesignData = Record<DesignDomain, DesignTable>;

const STOP = new Set(["the", "and", "for", "with", "a", "an", "of", "to", "in", "on", "or", "is", "are", "by", "at", "as"]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9åäöü]+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

interface Index {
  docs: Map<string, number>[];
  lengths: number[];
  avg: number;
  df: Map<string, number>;
}
const indexes = new Map<DesignDomain, Index>();

function indexFor(domain: DesignDomain): Index {
  const cached = indexes.get(domain);
  if (cached) return cached;
  const table = data[domain];
  const docs = table.rows.map((row) => {
    const tf = new Map<string, number>();
    for (const col of table.search) for (const t of tokenize(row[col] ?? "")) tf.set(t, (tf.get(t) ?? 0) + 1);
    return tf;
  });
  const lengths = docs.map((d) => [...d.values()].reduce((a, b) => a + b, 0));
  const df = new Map<string, number>();
  for (const d of docs) for (const t of d.keys()) df.set(t, (df.get(t) ?? 0) + 1);
  const index = { docs, lengths, avg: lengths.reduce((a, b) => a + b, 0) / Math.max(1, lengths.length), df };
  indexes.set(domain, index);
  return index;
}

/** BM25 ranking (k1 1.5, b 0.75) over the domain's search columns. */
export function searchDesign(domain: DesignDomain, query: string, maxResults = 3): Record<string, string>[] {
  const { docs, lengths, avg, df } = indexFor(domain);
  const terms = [...new Set(tokenize(query))];
  const n = docs.length;
  const scored = docs.map((tf, i) => {
    let score = 0;
    for (const t of terms) {
      const f = tf.get(t);
      if (!f) continue;
      const idf = Math.log(1 + (n - (df.get(t) ?? 0) + 0.5) / ((df.get(t) ?? 0) + 0.5));
      score += (idf * f * 2.5) / (f + 1.5 * (0.25 + (0.75 * lengths[i]) / avg));
    }
    return { i, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(5, Math.max(1, maxResults)))
    .map((s) => data[domain].rows[s.i]);
}

export const DESIGN_TOOL_NAME = "search_design_database";

export const DESIGN_TOOL_DESCRIPTION =
  "Search the UI UX Pro Max design database (English data). Domains: " +
  DESIGN_DOMAINS.map((d) => `${d} = ${data[d].description}`).join(" ") +
  " Returns a JSON array of the best matching rows, or an empty array when nothing matches.";

export const DESIGN_TOOL_SCHEMA = {
  type: "object" as const,
  properties: {
    domain: { type: "string", enum: DESIGN_DOMAINS, description: "Which table to search." },
    query: { type: "string", description: "2-5 English keywords with one dominant intent, e.g. 'restaurant dining warm'." },
    max_results: { type: "integer", description: "How many rows to return, 1-5 (default 3)." },
  },
  required: ["domain", "query"],
  additionalProperties: false,
};

/** Validates untrusted tool input and returns the tool result as a JSON string (max ~12 KB). */
export function runDesignTool(input: unknown): string {
  const i = (input ?? {}) as Record<string, unknown>;
  const domain = String(i.domain ?? "") as DesignDomain;
  if (!DESIGN_DOMAINS.includes(domain)) throw new Error(`Unknown domain. Use one of: ${DESIGN_DOMAINS.join(", ")}`);
  const query = String(i.query ?? "").slice(0, 200);
  if (!query.trim()) throw new Error("query must be a non-empty string");
  let max = Number.isFinite(Number(i.max_results)) ? Math.round(Number(i.max_results)) : 3;
  let out = JSON.stringify(searchDesign(domain, query, max));
  // Keep tool results small: drop rows until the answer fits.
  while (out.length > 12000 && max > 1) out = JSON.stringify(searchDesign(domain, query, --max));
  return out.length > 12000 ? out.slice(0, 12000) : out;
}

/** Runs several searches up front, for runtimes that cannot offer tools. */
export function designContext(queries: Partial<Record<DesignDomain, string>>): string {
  const parts: string[] = [];
  for (const domain of DESIGN_DOMAINS) {
    const q = queries[domain];
    if (!q) continue;
    parts.push(`<${domain} query="${q.replace(/"/g, "'")}">\n${runDesignTool({ domain, query: q, max_results: domain === "ux" ? 3 : 2 })}\n</${domain}>`);
  }
  return parts.join("\n");
}

/** The ui-ux-pro-max skill workflow, condensed for a one-page website demo. */
export const DESIGN_SKILL_GUIDE = `Design workflow (UI UX Pro Max skill). Before writing any HTML, build a design system with the ${DESIGN_TOOL_NAME} tool:
1. product: search the business type in English (e.g. "restaurant", "beauty salon spa", "construction contractor"). Note the recommended style, landing pattern, color mood, typography mood, decision rules and anti-patterns.
2. style: search the recommended style name. Apply its effects, CSS keywords and implementation checklist.
3. color: search the business type. Use the palette as CSS custom properties (--color-primary, --color-background, --color-foreground, --color-muted, --color-border...). Never put raw hex values directly in components.
4. typography: search the typography mood. Load exactly that Google Fonts URL and use the heading and body fonts.
5. landing: search the landing pattern. Follow its section order and CTA placement.
6. ux (optional, at most two searches): e.g. "contrast text" or "touch target size".
Each query: one dominant intent, 2-5 English keywords. If a search returns [] retry once with a narrower query; if it is still empty, use sensible defaults. You may run several searches in the same turn. Do not exceed 8 searches in total.

Rules by priority: (1) accessibility: text contrast at least 4.5:1, visible focus states, semantic landmarks, aria-labels on icon-only links; (2) touch targets at least 44x44px with 8px spacing; (3) performance: no layout shift, reserve space for visuals; (4) style matches the business type, inline SVG icons only, never emoji as icons; (5) mobile-first, no horizontal scroll at 360px; (6) body text 16px minimum, line-height about 1.5, semantic color tokens; (7) transitions 150-300ms and honour prefers-reduced-motion.

Pre-delivery checklist: no emoji icons; hover and focus states on every interactive element; contrast checked against the chosen background; responsive at 360px, 768px and 1280px; reduced-motion respected.`;
