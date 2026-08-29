import sharp from "sharp";

const files = [
  "public/rasengan.png",
  "public/hollow-purple.png",
  "public/sharingan.png",
  "public/six-eye.png",
  "public/shinigami-eyes.png",
  "public/cursors/kunai.png",
];

for (const f of files) {
  try {
    const img = sharp(f);
    const meta = await img.metadata();
    const stats = await img.stats();
    const alpha = stats.channels[3];
    console.log(
      `${f}\n  format=${meta.format} ${meta.width}x${meta.height} hasAlpha=${meta.hasAlpha}` +
        (alpha
          ? ` alphaMin=${alpha.min} alphaMax=${alpha.max} alphaMean=${alpha.mean.toFixed(1)}`
          : " (no alpha channel)")
    );
  } catch (err) {
    console.log(`${f}\n  ERROR: ${err.message}`);
  }
}
