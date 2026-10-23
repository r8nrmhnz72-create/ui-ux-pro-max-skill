// Renders motion/scene.html into the home-page video:
//   public/media/sivuseppa-motion.mp4   (H.264, plays everywhere)
//   public/media/sivuseppa-motion.webm  (VP9 fallback)
//   public/media/sivuseppa-motion-poster.jpg
//
// Usage (from the project folder; needs ffmpeg on PATH):
//   npm run render:motion
//   node motion/render.mjs --stills=2.5,6.5,13.6 --out=/some/dir   # preview single frames
// Set CHROMIUM_PATH to use a specific Chromium build.
import { spawn } from "node:child_process";
import { once } from "node:events";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const mediaDir = path.join(root, "public", "media");
const FPS = 30;
const W = 1920;
const H = 1080;
const POSTER_AT = 13.6;

const args = process.argv.slice(2);
const stillsArg = args.find((a) => a.startsWith("--stills="));
const outArg = args.find((a) => a.startsWith("--out="));

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.join(here, "scene.html")).href);
await page.waitForFunction(() => window.__ready === true, null, { timeout: 30_000 });
const duration = await page.evaluate(() => window.__duration);

async function frame(t, type = "png") {
  await page.evaluate((time) => window.__seek(time), t);
  return page.screenshot(type === "png" ? { type: "png" } : { type: "jpeg", quality: 84 });
}

if (stillsArg) {
  const dir = outArg ? outArg.slice("--out=".length) : path.join(here, "stills");
  fs.mkdirSync(dir, { recursive: true });
  for (const t of stillsArg.slice("--stills=".length).split(",").map(Number)) {
    fs.writeFileSync(path.join(dir, `still-${t.toFixed(2)}.png`), await frame(t));
  }
  console.log(`stills written to ${dir}`);
  await browser.close();
  process.exit(0);
}

fs.mkdirSync(mediaDir, { recursive: true });
const mp4 = path.join(mediaDir, "sivuseppa-motion.mp4");
const webm = path.join(mediaDir, "sivuseppa-motion.webm");

// One ffmpeg process reads PNG frames from stdin and writes both formats.
const ff = spawn(
  "ffmpeg",
  [
    "-y", "-loglevel", "error",
    "-f", "image2pipe", "-c:v", "png", "-framerate", String(FPS), "-i", "-",
    "-c:v", "libx264", "-preset", "slow", "-crf", "19", "-tune", "animation",
    "-pix_fmt", "yuv420p", "-profile:v", "high", "-movflags", "+faststart", "-an", mp4,
    "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "34", "-row-mt", "1", "-deadline", "good", "-cpu-used", "5",
    "-pix_fmt", "yuv420p", "-an", webm,
  ],
  { stdio: ["pipe", "inherit", "inherit"] },
);
const done = once(ff, "close");

const total = Math.round(duration * FPS);
const started = Date.now();
for (let i = 0; i < total; i++) {
  const png = await frame(i / FPS);
  if (!ff.stdin.write(png)) await once(ff.stdin, "drain");
  if (i % 90 === 0) console.log(`frame ${i}/${total} (${Math.round((Date.now() - started) / 1000)} s)`);
}
ff.stdin.end();
const [code] = await done;
if (code !== 0) throw new Error(`ffmpeg exited with ${code}`);

fs.writeFileSync(path.join(mediaDir, "sivuseppa-motion-poster.jpg"), await frame(POSTER_AT, "jpeg"));
await browser.close();

for (const f of [mp4, webm, path.join(mediaDir, "sivuseppa-motion-poster.jpg")]) {
  console.log(`${path.relative(root, f)}: ${(fs.statSync(f).size / 1024 / 1024).toFixed(2)} MB`);
}
console.log(`done in ${Math.round((Date.now() - started) / 1000)} s`);
