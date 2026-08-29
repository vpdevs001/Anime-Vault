/**
 * One-shot FX image optimizer.
 *
 * The source art in `public/*.png` is exported on 1536x1024 canvases with the
 * energy/eye off-centre and ~2MB of weight. The FX components spin these
 * images, so any off-centre composition reads as a wobble. This script:
 *   1. `trim()`s transparent padding so the subject is centred (true spin).
 *   2. Resizes to a sensible display cap (they render at ~44-132 CSS px).
 *   3. Writes optimized copies to `public/fx/` — originals are untouched.
 *   4. Builds a 28px kunai cursor sprite (custom cursors must be small).
 *
 * Run: `node scripts/optimize-fx-images.mjs`  (re-run any time art changes)
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const OUT = "public/fx";

/* name → { src, cap } ; cap = max width in px after trimming */
const FX = [
  { src: "public/rasengan.png", out: "rasengan", cap: 320 },
  { src: "public/hollow-purple.png", out: "hollow-purple", cap: 256 },
  { src: "public/sharingan.png", out: "sharingan", cap: 256 },
  { src: "public/six-eye.png", out: "six-eyes", cap: 256 },
  { src: "public/shinigami-eyes.png", out: "shinigami-eye", cap: 256 },
];

await mkdir(OUT, { recursive: true });

for (const { src, out, cap } of FX) {
  const buf = await sharp(src)
    .trim() // strip transparent margins → subject centred for clean rotation
    .resize({ width: cap, withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: false })
    .toBuffer();
  const meta = await sharp(buf).metadata();
  await sharp(buf).toFile(`${OUT}/${out}.png`);
  console.log(
    `${out}.png  ${meta.width}x${meta.height}  ${(buf.length / 1024).toFixed(1)}kb`
  );
}

/* Kunai cursor — browsers want tiny cursors; 28px with a crisp alpha edge */
const kunai = await sharp("public/cursors/kunai.png")
  .trim()
  .resize({ width: 28, withoutEnlargement: true })
  .png({ compressionLevel: 9 })
  .toBuffer();
const km = await sharp(kunai).metadata();
await sharp(kunai).toFile(`${OUT}/kunai-cursor.png`);
console.log(`kunai-cursor.png  ${km.width}x${km.height}  ${(kunai.length / 1024).toFixed(1)}kb`);

console.log("done");
