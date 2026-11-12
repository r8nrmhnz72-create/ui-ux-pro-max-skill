/**
 * Derives the small belt versions of the plates.
 *
 *   public/plates/<id>.webp     880 px, shown in the template dialog   (from render-plates.cjs)
 *   public/plates/<id>-sm.webp  360 px, shown on the conveyor belt     (this script)
 *
 * On the belt a plate is at most 150 CSS px wide, so 360 px covers 2x screens and the page
 * carries about a quarter of the bytes. Run it after render-plates.cjs:
 *
 *   node scripts/art/resize-plates.cjs
 */
const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const dir = path.join(__dirname, "..", "..", "public", "plates");
const SIZE = 360;

(async () => {
  const sources = fs.readdirSync(dir).filter((name) => name.endsWith(".webp") && !name.endsWith("-sm.webp")).sort();
  for (const name of sources) {
    const target = path.join(dir, name.replace(/\.webp$/, "-sm.webp"));
    await sharp(path.join(dir, name))
      .resize(SIZE, SIZE, { kernel: "lanczos3" })
      .webp({ quality: 84, alphaQuality: 100, effort: 6 })
      .toFile(target);
    console.log(`${path.basename(target)}  ${(fs.statSync(target).size / 1024).toFixed(1)} kB`);
  }
})();
