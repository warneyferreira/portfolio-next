// Recorta o mar do wallpaper: o céu preto vira transparente para o hero
// alternativo pintar um fundo claro atrás e mover as camadas em parallax.
//
//   node scripts/recortar-mar.mjs <origem.png> [destino.webp]
//
// Como funciona: inundação a partir da borda de cima sobre pixels escuros
// (o céu). A inundação só desce até LIMITE_Y, então os vales escuros do
// fundo do mar nunca vazam. Numa faixa de FAIXA px em volta do céu, o alfa
// vem do brilho do pixel e a cor é "despremultiplicada" do céu: some a
// franja preta dos respingos e os bolsões de céu presos entre eles, sem
// furar as ondas azuis (bem mais claras que o céu). O topo vazio é cortado.
import sharp from "sharp";

const [origem, destino = "src/components/alternative/hero/mar.webp"] = process.argv.slice(2);
if (!origem) {
  console.error("uso: node scripts/recortar-mar.mjs <origem.png> [destino.webp]");
  process.exit(1);
}

const CEU_MAX = 22; // maior canal ≤ isto conta como céu
const BORDA_MAX = 60; // na faixa, brilho em que o alfa chega a 1
const FAIXA = 24; // px em volta do céu onde o alfa é suave
// Rente ao céu (≤ RENTE px) a rampa vai até BORDA_RENTE: tira o anel
// escuro de meio-tom em volta dos respingos brancos.
const RENTE = 3;
const BORDA_RENTE = 180;
const LIMITE_Y = 0.6; // fração da altura onde a inundação para
const FOLGA_TOPO = 24; // px de respiro acima do primeiro respingo

const { data, info } = await sharp(origem).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const limite = Math.round(H * LIMITE_Y);
const brilho = (i) => Math.max(data[i * 3], data[i * 3 + 1], data[i * 3 + 2]);

// Cor média do céu, para despremultiplicar a borda.
let soma = [0, 0, 0];
let n = 0;
for (let y = 0; y < H * 0.25; y += 2) {
  for (let x = 0; x < W; x += 2) {
    const i = (y * W + x) * 3;
    soma[0] += data[i];
    soma[1] += data[i + 1];
    soma[2] += data[i + 2];
    n++;
  }
}
const ceu = soma.map((v) => v / n);

// Inundação a partir da primeira linha.
const eCeu = new Uint8Array(W * H);
const pilha = new Int32Array(W * limite);
let topo = 0;
for (let x = 0; x < W; x++) {
  if (brilho(x) <= CEU_MAX) {
    eCeu[x] = 1;
    pilha[topo++] = x;
  }
}
while (topo) {
  const p = pilha[--topo];
  const x = p % W;
  const y = (p - x) / W;
  for (const q of [x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1, y > 0 ? p - W : -1, y < limite - 1 ? p + W : -1]) {
    if (q >= 0 && !eCeu[q] && brilho(q) <= CEU_MAX) {
      eCeu[q] = 1;
      pilha[topo++] = q;
    }
  }
}

// Distância (em passos de 4 vizinhos) até o céu, só até FAIXA.
function distancias() {
  const dist = new Uint8Array(W * H).fill(255);
  let fila = [];
  for (let p = 0; p < W * limite; p++) if (eCeu[p]) { dist[p] = 0; fila.push(p); }
  for (let d = 1; d <= FAIXA; d++) {
    const prox = [];
    for (const p of fila) {
      const x = p % W;
      for (const q of [x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1, p - W, p + W]) {
        if (q >= 0 && q < W * H && dist[q] === 255) { dist[q] = d; prox.push(q); }
      }
    }
    fila = prox;
  }
  return dist;
}

// Bolsões de céu presos entre respingos (escuros e perto do céu) viram
// céu, e as distâncias são refeitas para a borda deles também ficar limpa.
let dist = distancias();
for (let p = 0; p < W * limite; p++) if (dist[p] <= FAIXA && brilho(p) <= CEU_MAX) eCeu[p] = 1;
dist = distancias();

// RGBA: céu some; a faixa ganha alfa suave e cor limpa.
const saida = Buffer.alloc(W * H * 4);
let primeiraLinha = H;
for (let p = 0; p < W * H; p++) {
  const o = p * 4;
  if (eCeu[p]) continue; // transparente
  const x = p % W;
  const y = (p - x) / W;
  let a = 1;
  if (dist[p] <= FAIXA) {
    const max = dist[p] <= RENTE ? BORDA_RENTE : BORDA_MAX;
    const t = Math.min(1, Math.max(0, (brilho(p) - CEU_MAX) / (max - CEU_MAX)));
    a = t * t * (3 - 2 * t);
  }
  if (a <= 0) continue;
  for (let c = 0; c < 3; c++) {
    const v = data[p * 3 + c];
    saida[o + c] = Math.min(255, Math.max(0, Math.round((v - (1 - a) * ceu[c]) / a)));
  }
  saida[o + 3] = Math.round(a * 255);
  if (y < primeiraLinha) primeiraLinha = y;
}

const corte = Math.max(0, primeiraLinha - FOLGA_TOPO);
await sharp(saida, { raw: { width: W, height: H, channels: 4 } })
  .extract({ left: 0, top: corte, width: W, height: H - corte })
  .webp({ quality: 88, alphaQuality: 100, effort: 6 })
  .toFile(destino);

console.log(`céu ≈ rgb(${ceu.map(Math.round).join(",")}); corte no topo: ${corte}px; saída ${W}×${H - corte} → ${destino}`);
