// Recorta as ondas (gravura japonesa em azul-cobalto sobre papel creme)
// para o chão do hero alternativo, no lugar das colinas: o papel do céu
// vira transparente e sobram as ondas com a espuma.
//
//   node scripts/recortar-ondas.mjs <origem.png> [pasta-destino]
//
// A origem tem o mesmo quadro da paisagem (1672×941); a saída entra em
// paisagem/ como ondas.webp + ondas.ts (a caixa da peça no quadro), lida
// junto com camadas.ts por paisagem/Camada.tsx.
//
// Como funciona: a espuma é do mesmo creme do papel, então a inundação a
// partir do topo não pode simplesmente seguir o creme — ela entraria pela
// espuma das cristas. Ela anda só onde o creme é largo (máscara erodida em
// RAIO px: o céu aberto e o miolo dos cachos das ondas) e depois volta a
// crescer RAIO px dentro do creme. A espuma, recortada em células finas
// pelo traço azul, fica. Na borda, o alfa sai do quanto o pixel é mais
// escuro que o papel, e a cor é "despremultiplicada" do papel.
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const [origem, destino = "src/components/alternative/paisagem"] = process.argv.slice(2);
if (!origem) {
  console.error("uso: node scripts/recortar-ondas.mjs <origem.png> [pasta-destino]");
  process.exit(1);
}

const RAIO = 3; // px: canais de creme mais finos que 2·RAIO+1 não passam
const CLARO = 172; // vermelho acima disto conta como papel/espuma
const BORDA = 2; // px de borda suave em volta do céu

const { data: src, info } = await sharp(origem).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const N = W * H;
const R = (p) => src[p * 3];

// Distância (chamfer 3-4, em px aproximados) até o pixel marcado mais perto.
function distancia(marca) {
  const d = new Float32Array(N);
  for (let p = 0; p < N; p++) d[p] = marca[p] ? 0 : 1e9;
  const passo = (p, q, c) => {
    if (d[q] + c < d[p]) d[p] = d[q] + c;
  };
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const p = y * W + x;
      if (x > 0) passo(p, p - 1, 1);
      if (y > 0) {
        passo(p, p - W, 1);
        if (x > 0) passo(p, p - W - 1, 1.4142);
        if (x < W - 1) passo(p, p - W + 1, 1.4142);
      }
    }
  }
  for (let y = H - 1; y >= 0; y--) {
    for (let x = W - 1; x >= 0; x--) {
      const p = y * W + x;
      if (x < W - 1) passo(p, p + 1, 1);
      if (y < H - 1) {
        passo(p, p + W, 1);
        if (x < W - 1) passo(p, p + W + 1, 1.4142);
        if (x > 0) passo(p, p + W - 1, 1.4142);
      }
    }
  }
  return d;
}

function inundar(sementes, passa) {
  const cheio = new Uint8Array(N);
  const pilha = new Int32Array(N);
  let topo = 0;
  const empurra = (q) => {
    if (!cheio[q] && passa(q)) {
      cheio[q] = 1;
      pilha[topo++] = q;
    }
  };
  for (const p of sementes) empurra(p);
  while (topo) {
    const p = pilha[--topo];
    const x = p % W;
    if (x > 0) empurra(p - 1);
    if (x < W - 1) empurra(p + 1);
    if (p >= W) empurra(p - W);
    if (p < N - W) empurra(p + W);
  }
  return cheio;
}

const claro = Uint8Array.from({ length: N }, (_, p) => (R(p) > CLARO ? 1 : 0));
const longeDoAzul = distancia(Uint8Array.from(claro, (v) => 1 - v));
const largo = (p) => longeDoAzul[p] > RAIO;
const topoLinha = Array.from({ length: W }, (_, x) => x);
const ceuLargo = inundar(topoLinha, largo);
const distCeu = distancia(ceuLargo);
const ceu = Uint8Array.from({ length: N }, (_, p) => (claro[p] && distCeu[p] <= RAIO + 0.5 ? 1 : 0));

// Cor do papel (média do topo), para alfa e despremultiplicação.
const papel = [0, 0, 0];
{
  let n = 0;
  for (let p = 0; p < W * 40; p++) {
    for (let c = 0; c < 3; c++) papel[c] += src[p * 3 + c];
    n++;
  }
  for (let c = 0; c < 3; c++) papel[c] /= n;
}

const distAoCeu = distancia(ceu);
const out = Buffer.alloc(N * 4);
let primeira = H;
for (let p = 0; p < N; p++) {
  if (ceu[p]) continue;
  let a = 1;
  if (distAoCeu[p] <= BORDA) {
    // Rente ao céu: alfa pelo quanto o vermelho cai abaixo do papel.
    a = Math.min(1, Math.max(0, (papel[0] - R(p)) / (papel[0] - 60)));
    a = a * a * (3 - 2 * a);
  }
  if (a <= 0.01) continue;
  const o = p * 4;
  for (let c = 0; c < 3; c++) {
    out[o + c] = Math.min(255, Math.max(0, Math.round((src[p * 3 + c] - (1 - a) * papel[c]) / a)));
  }
  out[o + 3] = Math.round(a * 255);
  const y = Math.floor(p / W);
  if (y < primeira) primeira = y;
}

const y0 = Math.max(0, primeira - 2);
const h = H - y0;
await sharp(out, { raw: { width: W, height: H, channels: 4 } })
  .extract({ left: 0, top: y0, width: W, height: h })
  .webp({ quality: 90, alphaQuality: 100, smartSubsample: true, effort: 6 })
  .toFile(path.join(destino, "ondas.webp"));

await writeFile(
  path.join(destino, "ondas.ts"),
  `// Gerado por scripts/recortar-ondas.mjs — não edite à mão.
// Caixa da peça em px do quadro original (${W}×${H}), como em camadas.ts.
import ondas from "./ondas.webp";

export const camadasOndas = {
  ondas: { src: ondas, x: 0, y: ${y0}, w: ${W}, h: ${h} },
} as const;
`,
);
console.log(`papel ≈ rgb(${papel.map(Math.round).join(",")}); ondas ${W}×${h} em y=${y0} → ${destino}`);
