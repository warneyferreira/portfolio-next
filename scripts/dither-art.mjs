/**
 * Reticula uma imagem em 1 bit (tinta sobre papel) com dithering ordenado
 * Bayer 8×8. Saída: WebP sem perda, preto com alfa 0 ou 255 — usar em CSS
 * como máscara sobre `background-color: var(--ink)`.
 *
 * Uso:
 *   node scripts/dither-art.mjs <entrada> <saída> [--mode orange|gray] [--resize LxA]
 *
 *   --mode orange  fonte laranja sobre papel marfim (padrão):
 *                  ink = clamp((240 - G) / 165, 0, 1)
 *   --mode gray    fonte em tons de cinza: ink = 1 - luminância/255
 *   --resize LxA   redimensiona antes de reticular (ex.: --resize 1672x1928)
 *
 * Exemplo:
 *   node scripts/dither-art.mjs \
 *     public/images/background/hero-about-continuous.webp \
 *     public/images/background/hero-about-dither.webp
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
    return [0, 2, 3, 1][quadrant] * 16 + q;
  }),
);

const args = process.argv.slice(2);
const [input, output] = args.filter((a) => !a.startsWith("--"));
const mode = args.includes("--mode") ? args[args.indexOf("--mode") + 1] : "orange";
const resizeIndex = args.indexOf("--resize");
const resize = resizeIndex !== -1 ? args[resizeIndex + 1] : null;

if (!input || !output) {
  console.error("Uso: node scripts/dither-art.mjs <entrada> <saída> [--mode orange|gray] [--resize LxA]");
  process.exit(1);
}

let pipeline = sharp(input).removeAlpha();
if (resize) {
  const [width, height] = resize.split("x").map(Number);
  pipeline = pipeline.resize(width, height, { fit: "fill" });
}

const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

// Saída RGBA: preto, alfa 0 ou 255.
const out = Buffer.alloc(width * height * 4);
for (let y = 0; y < height; y++) {
  const row = BAYER8[y % 8];
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * channels;
    let ink;
    if (mode === "gray") {
      const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      ink = 1 - lum / 255;
    } else {
      ink = Math.min(1, Math.max(0, (240 - data[i + 1]) / 165));
    }
    const on = ink * 64 > row[x % 8] + 0.5;
    const o = (y * width + x) * 4;
    out[o] = 0;
    out[o + 1] = 0;
    out[o + 2] = 0;
    out[o + 3] = on ? 255 : 0;
  }
}

await sharp(out, { raw: { width, height, channels: 4 } })
  .webp({ lossless: true, effort: 6 })
  .toFile(output);

console.log(`${output}: ${width}x${height}, modo ${mode}`);
