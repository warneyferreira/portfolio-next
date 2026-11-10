/**
 * Prepara máscaras 1 bit (tinta sobre papel) para CSS: WebP sem perda,
 * preto com alfa 0 ou 255 — usar sobre `background-color: var(--ink)`.
 *
 * Uso:
 *   node scripts/dither-art.mjs <entrada> <saída> --mode line --width <px> --threshold <0-255>
 *   node scripts/dither-art.mjs <entrada> <saída> --mode bayer
 *
 *   --mode line   Gravura de linha: tons de cinza, redimensiona para
 *                 --width (lanczos3) e tinta onde cinza < threshold.
 *                 Sem matriz de dither — o traço da gravura já tem o
 *                 próprio pontilhado; re-reticular cria moiré.
 *   --mode bayer  Dither ordenado Bayer 8×8 em tons de cinza, com
 *                 cinza >= 235 tratado como papel puro (para fotos).
 *
 * Exemplo:
 *   node scripts/dither-art.mjs scripts/sources/hero-engraving.webp \
 *     public/images/background/hero-engraving.webp \
 *     --mode line --width 3344 --threshold 128
 */
import sharp from "sharp";

const BAYER4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

// Matriz Bayer 8×8 crescida da 4×4 (mesma fórmula de src/lib/dither.ts).
const BAYER8 = Array.from({ length: 8 }, (_, y) =>
  Array.from({ length: 8 }, (_, x) => {
    const q = BAYER4[y % 4][x % 4];
    const quadrant = (y >> 2) * 2 + (x >> 2);
    return q * 4 + [0, 2, 3, 1][quadrant];
  }),
);

const args = process.argv.slice(2);
const [input, output] = args.filter((a) => !a.startsWith("--"));
const mode = args.includes("--mode") ? args[args.indexOf("--mode") + 1] : null;
const widthIndex = args.indexOf("--width");
const width = widthIndex !== -1 ? Number(args[widthIndex + 1]) : null;
const thresholdIndex = args.indexOf("--threshold");
const threshold = thresholdIndex !== -1 ? Number(args[thresholdIndex + 1]) : 128;

if (!input || !output || !mode || (mode === "line" && !width)) {
  console.error(
    "Uso: node scripts/dither-art.mjs <entrada> <saída> --mode line --width <px> --threshold <0-255>\n" +
      "      node scripts/dither-art.mjs <entrada> <saída> --mode bayer",
  );
  process.exit(1);
}

let pipeline = sharp(input).grayscale();
if (mode === "line") {
  pipeline = pipeline.resize(width, null, { kernel: "lanczos3" });
}

const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h, channels } = info;

// Saída RGBA: preto, alfa 0 ou 255.
const out = Buffer.alloc(w * h * 4);
for (let y = 0; y < h; y++) {
  const row = BAYER8[y % 8];
  for (let x = 0; x < w; x++) {
    const grey = data[y * w * channels + x * channels];
    const on = mode === "line" ? grey < threshold : grey < 235 && grey * 64 > row[x % 8] * 255 + 128;
    const o = (y * w + x) * 4;
    out[o] = 0;
    out[o + 1] = 0;
    out[o + 2] = 0;
    out[o + 3] = on ? 255 : 0;
  }
}

await sharp(out, { raw: { width: w, height: h, channels: 4 } })
  .webp({ lossless: true, effort: 6 })
  .toFile(output);

console.log(`${output}: ${w}x${h}, modo ${mode}${mode === "line" ? ` (threshold ${threshold})` : ""}`);
