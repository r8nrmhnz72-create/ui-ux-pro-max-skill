// Renders the example website designs in art/stack-cards.html into the
// images of the "Ei kahta samanlaista" scroll section:
//   public/media/stack/<card id>.jpg   (800 × 800 px)
//
// Usage (from the project folder):
//   npm run render:stack
//   node art/render-stack-cards.mjs --sheet=/some/dir/sheet.png   # also save an overview of all cards
// Set CHROMIUM_PATH to use a specific Chromium build.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const outDir = path.join(root, "public", "media", "stack");
const sheetArg = process.argv.slice(2).find((a) => a.startsWith("--sheet="));

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 2160, height: 1100 }, deviceScaleFactor: 1.6 });
await page.goto(pathToFileURL(path.join(here, "stack-cards.html")).href);
await page.evaluate(() => window.__ready);

fs.mkdirSync(outDir, { recursive: true });
const ids = await page.$$eval(".card", (cards) => cards.map((card) => card.id));
for (const id of ids) {
  const file = path.join(outDir, `${id}.jpg`);
  await page.locator(`#${id}`).screenshot({ path: file, type: "jpeg", quality: 86 });
  console.log(`${path.relative(root, file)}: ${Math.round(fs.statSync(file).size / 1024)} KB`);
}

if (sheetArg) {
  const sheet = sheetArg.slice("--sheet=".length);
  await page.setViewportSize({ width: 2160, height: 1100 });
  await page.screenshot({ path: sheet, fullPage: true, scale: "css" });
  console.log(`overview: ${sheet}`);
}
await browser.close();
