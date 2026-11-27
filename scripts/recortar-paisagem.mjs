// Recorta a paisagem do hero alternativo (céu em retícula, nuvens em
// meio-tom, sol espiral, cúmulos com contorno de nanquim e colinas) em
// camadas PNG→WebP com transparência, para o hero mover cada uma em
// parallax e as outras seções reaproveitarem as peças.
//
//   node scripts/recortar-paisagem.mjs <origem.png> [pasta-destino]
//
// Saída (na pasta, padrão src/components/alternative/paisagem/):
//   ceu.webp       — o céu inteiro, opaco, sem nada na frente: onde havia
//                    nuvem, sol ou colina, a retícula do próprio céu é
//                    repetida (tom e contraste locais do céu em volta).
//   nuvem-*.webp   — cada grupo de nuvens em meio-tom, recortado com os
//                    pontos e o azul entre eles; borda quase dura.
//   sol.webp       — o sol, com raios, anel e espiral.
//   cumulos.webp   — os cúmulos com o contorno e a sombra do nanquim.
//   colinas.webp   — a grama com a borda de papel, até o pé da imagem.
//   camadas.ts     — import de cada arquivo + a caixa dele no quadro
//                    original (para montar as camadas no lugar exato).
//
// Ordem de trás para frente: céu → nuvens → sol → cúmulos → colinas.
// Cada camada esconde o que está atrás dela: o céu é refeito embaixo de
// tudo (o sol e os cúmulos podem sair do lugar), as nuvens não têm pontos
// onde o sol estava, e os cúmulos descem alguns px por baixo das colinas
// (a borda das colinas não deixa ver o céu).
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const [origem, destino = "src/components/alternative/paisagem"] = process.argv.slice(2);
if (!origem) {
  console.error("uso: node scripts/recortar-paisagem.mjs <origem.png> [pasta-destino]");
  process.exit(1);
}

const { data: src, info } = await sharp(origem).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const N = W * H;
const R = (p) => src[p * 3];
const G = (p) => src[p * 3 + 1];
const B = (p) => src[p * 3 + 2];

// ---------- utilidades ----------

function caixaBorrada(f, raio) {
  // Média móvel separável (caixa), bordas pelo tamanho real da janela.
  const tmp = new Float32Array(N);
  const out = new Float32Array(N);
  for (let y = 0; y < H; y++) {
    let s = 0;
    const o = y * W;
    for (let x = 0; x <= Math.min(raio, W - 1); x++) s += f[o + x];
    for (let x = 0; x < W; x++) {
      const a = x - raio - 1;
      const b = x + raio;
      if (x > 0) {
        if (b < W) s += f[o + b];
        if (a >= 0) s -= f[o + a];
      }
      tmp[o + x] = s / (Math.min(W - 1, b) - Math.max(0, a + 1) + 1);
    }
  }
  for (let x = 0; x < W; x++) {
    let s = 0;
    for (let y = 0; y <= Math.min(raio, H - 1); y++) s += tmp[y * W + x];
    for (let y = 0; y < H; y++) {
      const a = y - raio - 1;
      const b = y + raio;
      if (y > 0) {
        if (b < H) s += tmp[b * W + x];
        if (a >= 0) s -= tmp[a * W + x];
      }
      out[y * W + x] = s / (Math.min(H - 1, b) - Math.max(0, a + 1) + 1);
    }
  }
  return out;
}

// Quase gaussiana: três caixas.
const borrar = (f, raio) => caixaBorrada(caixaBorrada(caixaBorrada(f, raio), raio), raio);

// Média de f só onde peso > 0 (convolução normalizada), contínua: começa
// no raio maior (que precisa cobrir a imagem) e cada raio menor assume
// onde tem peso suficiente por perto, com transição suave.
function mediaPonderada(f, peso, raios) {
  const out = new Float32Array(N);
  const fp = new Float32Array(N);
  for (let p = 0; p < N; p++) fp[p] = f[p] * peso[p];
  for (const [i, raio] of [...raios].sort((a, b) => b - a).entries()) {
    const num = borrar(fp, raio);
    const den = borrar(peso, raio);
    for (let p = 0; p < N; p++) {
      if (den[p] <= 1e-6) continue;
      const t = i === 0 ? 1 : smooth(0.05, 0.4, den[p]);
      out[p] += (num[p] / den[p] - out[p]) * t;
    }
  }
  return out;
}

// Distância euclidiana exata até o pixel marcado mais próximo
// (Felzenszwalb & Huttenlocher), em px.
function distancia(marca) {
  const INF = 1e12;
  const g = new Float64Array(N);
  for (let p = 0; p < N; p++) g[p] = marca[p] ? 0 : INF;
  const n = Math.max(W, H);
  const f = new Float64Array(n);
  const d = new Float64Array(n);
  const v = new Int32Array(n);
  const z = new Float64Array(n + 1);
  const passo = (len) => {
    let k = 0;
    v[0] = 0;
    z[0] = -INF;
    z[1] = INF;
    for (let q = 1; q < len; q++) {
      let s;
      while (((s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k])), s <= z[k])) k--;
      k++;
      v[k] = q;
      z[k] = s;
      z[k + 1] = INF;
    }
    k = 0;
    for (let q = 0; q < len; q++) {
      while (z[k + 1] < q) k++;
      d[q] = (q - v[k]) * (q - v[k]) + f[v[k]];
    }
  };
  for (let x = 0; x < W; x++) {
    for (let y = 0; y < H; y++) f[y] = g[y * W + x];
    passo(H);
    for (let y = 0; y < H; y++) g[y * W + x] = d[y];
  }
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) f[x] = g[y * W + x];
    passo(W);
    for (let x = 0; x < W; x++) g[y * W + x] = d[x];
  }
  const out = new Float32Array(N);
  for (let p = 0; p < N; p++) out[p] = Math.sqrt(g[p]);
  return out;
}

const dilatar = (m, r) => {
  const d = distancia(m);
  return Uint8Array.from(d, (v) => (v <= r ? 1 : 0));
};

// Inundação 4-conexa a partir das sementes, só por pixels passáveis.
function inundar(sementes, passa) {
  const cheio = new Uint8Array(N);
  const pilha = new Int32Array(N);
  let topo = 0;
  for (const p of sementes) {
    if (passa(p) && !cheio[p]) {
      cheio[p] = 1;
      pilha[topo++] = p;
    }
  }
  const empurra = (q) => {
    if (!cheio[q] && passa(q)) {
      cheio[q] = 1;
      pilha[topo++] = q;
    }
  };
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

// Componentes 8-conexos de uma máscara: rótulo por pixel + lista.
function componentes(m) {
  const rot = new Int32Array(N).fill(-1);
  const lista = [];
  const pilha = new Int32Array(N);
  for (let s = 0; s < N; s++) {
    if (!m[s] || rot[s] >= 0) continue;
    const id = lista.length;
    const c = { id, area: 0, x0: W, y0: H, x1: 0, y1: 0 };
    let topo = 0;
    rot[s] = id;
    pilha[topo++] = s;
    while (topo) {
      const p = pilha[--topo];
      const x = p % W;
      const y = (p - x) / W;
      c.area++;
      if (x < c.x0) c.x0 = x;
      if (x > c.x1) c.x1 = x;
      if (y < c.y0) c.y0 = y;
      if (y > c.y1) c.y1 = y;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx;
          const yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
          const q = yy * W + xx;
          if (m[q] && rot[q] < 0) {
            rot[q] = id;
            pilha[topo++] = q;
          }
        }
      }
    }
    lista.push(c);
  }
  return { rot, lista };
}

// Fecha buracos: tudo que não é alcançável da borda sem cruzar a máscara.
function fecharBuracos(m) {
  const borda = [];
  for (let x = 0; x < W; x++) borda.push(x, (H - 1) * W + x);
  for (let y = 0; y < H; y++) borda.push(y * W, y * W + W - 1);
  const fora = inundar(borda, (p) => !m[p]);
  return Uint8Array.from(fora, (v) => 1 - v);
}

const smooth = (a, b, v) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// ---------- 1. Colinas ----------
// Altura da grama em cada coluna: sobe do pé da imagem enquanto houver
// grama (8 px seguidos sem grama encerram). Grama é tudo que não é azul
// (céu, sombra dos cúmulos) nem claro (creme, borda de papel); o quase
// preto das sombras da grama conta. Acima dela, a borda de papel clara
// (até 6 px). As duas linhas são suavizadas (mediana + média) e o alfa é
// antisserrilhado sobre a linha em fração de px.
const eGrama = (p) => (B(p) < 0.8 * G(p) || Math.max(R(p), G(p), B(p)) < 30) && Math.min(R(p), G(p), B(p)) < 150;
const topoGrama = new Float32Array(W);
for (let x = 0; x < W; x++) {
  let topo = H - 1;
  let falhas = 0;
  for (let y = H - 1; y >= 0; y--) {
    if (eGrama(y * W + x)) {
      topo = y;
      falhas = 0;
    } else if (++falhas >= 8) break;
  }
  topoGrama[x] = topo;
}
const mediana = (arr, r) =>
  Float32Array.from(arr, (_, i) => {
    const jan = [];
    for (let k = Math.max(0, i - r); k <= Math.min(arr.length - 1, i + r); k++) jan.push(arr[k]);
    return jan.sort((a, b) => a - b)[jan.length >> 1];
  });
const media = (arr, r) =>
  Float32Array.from(arr, (_, i) => {
    let s = 0;
    let n = 0;
    for (let k = Math.max(0, i - r); k <= Math.min(arr.length - 1, i + r); k++) {
      s += arr[k];
      n++;
    }
    return s / n;
  });
const grama = mediana(topoGrama, 6);
const bordaPapel = new Float32Array(W);
for (let x = 0; x < W; x++) {
  let y = Math.round(grama[x]) - 1;
  let n = 0;
  while (n < 6 && y > 0) {
    const p = y * W + x;
    if (Math.max(R(p), G(p), B(p)) < 160) break;
    y--;
    n++;
  }
  bordaPapel[x] = y + 1;
}
const linhaColina = media(mediana(bordaPapel, 4), 3);
const alfaColina = new Float32Array(N);
for (let x = 0; x < W; x++) {
  for (let y = 0; y < H; y++) alfaColina[y * W + x] = Math.min(1, Math.max(0, y + 1 - linhaColina[x]));
}
const colina = Uint8Array.from(alfaColina, (a) => (a > 0 ? 1 : 0));

// ---------- 2. Sol ----------
// Dentro da caixa do sol, inunda a partir da borda da caixa por tudo que
// não é amarelo nem azul-marinho (céu, pontos do céu, nuvem): o que sobra
// é o sol. Ficam só os pedaços com amarelo — pontos escuros soltos do céu e
// o contorno dos cúmulos (que também é azul-marinho) caem fora; raios
// soltos do anel ficam. Buracos (espiral, anel) são fechados.
const caixaSol = { x0: 1120, y0: 0, x1: 1520, y1: 360 };
const naCaixaSol = (p) => {
  const x = p % W;
  const y = (p - x) / W;
  return x >= caixaSol.x0 && x <= caixaSol.x1 && y >= caixaSol.y0 && y <= caixaSol.y1;
};
const eAmarelo = (p) => R(p) > 150 && G(p) > 110 && R(p) - B(p) > 90;
const eMarinho = (p) => B(p) > R(p) + 25 && G(p) < 42 && B(p) < 110;
const semSol = [];
for (let x = caixaSol.x0; x <= caixaSol.x1; x++) semSol.push(caixaSol.y0 * W + x, caixaSol.y1 * W + x);
for (let y = caixaSol.y0; y <= caixaSol.y1; y++) semSol.push(y * W + caixaSol.x0, y * W + caixaSol.x1);
const foraDoSol = inundar(semSol, (p) => naCaixaSol(p) && !eAmarelo(p) && !eMarinho(p));
let sol = new Uint8Array(N);
for (let p = 0; p < N; p++) if (naCaixaSol(p) && !foraDoSol[p]) sol[p] = 1;
{
  const { rot, lista } = componentes(sol);
  const amarelos = new Int32Array(lista.length);
  for (let p = 0; p < N; p++) if (rot[p] >= 0 && eAmarelo(p)) amarelos[rot[p]]++;
  sol = Uint8Array.from(rot, (r) => (r >= 0 && amarelos[r] >= 40 ? 1 : 0));
  sol = fecharBuracos(sol);
}

// O que o sol cobre não existe na imagem: lá as nuvens ficam sem pontos
// (alfa 0) e o céu é refeito como no resto (ver 5).
const solLargo = dilatar(sol, 2);

// ---------- 3. Cúmulos ----------
// O contorno de nanquim (quase preto) fecha os cúmulos. Inunda o céu a
// partir do topo e da esquerda sem atravessar nanquim nem grama: o que fica
// de fora da inundação, acima das colinas, é cúmulo. A sombra esfumada do
// nanquim, por fora do contorno, entra como preto com alfa (o quanto o
// pixel é mais escuro que o céu em volta).
const eNanquim = (p) => Math.max(R(p), G(p), B(p)) <= 62 && B(p) <= 66 && R(p) <= 40 && !solLargo[p];
const nanquim = dilatar(Uint8Array.from({ length: N }, (_, p) => (eNanquim(p) ? 1 : 0)), 1.5);
const sementesCeu = [];
for (let x = 0; x < W; x++) sementesCeu.push(x);
for (let y = 0; y < H; y++) sementesCeu.push(y * W);
// A colina alargada fecha a passagem por baixo das pontas do contorno (na
// ponta esquerda, a última bolha encosta na grama sem nanquim).
const barreira = dilatar(colina, 20);
const ceuAberto = inundar(sementesCeu, (p) => !nanquim[p] && !barreira[p]);
let cumulo = new Uint8Array(N);
for (let p = 0; p < N; p++) if (!ceuAberto[p] && !barreira[p]) cumulo[p] = 1;
{
  const { rot, lista } = componentes(cumulo);
  const grandes = new Set(lista.filter((c) => c.area > 20000).map((c) => c.id));
  cumulo = Uint8Array.from(rot, (r) => (grandes.has(r) ? 1 : 0));
}
// A faixa da barreira acima da grama: o que não é céu (creme, sombra
// azul-acinzentada das bolhas) e encosta no cúmulo é cúmulo — inclui a
// última bolha da ponta esquerda, que não tem contorno. O céu (azul bem
// mais forte que o vermelho, também nos pontos claros) fica de fora.
// Depois desce 6 px por baixo da borda das colinas.
{
  const faixa = (p) => barreira[p] && !colina[p];
  const sementes = [];
  for (let p = 0; p < N; p++) if (cumulo[p] && (faixa(p - W) || faixa(p + W) || faixa(p - 1) || faixa(p + 1))) sementes.push(p);
  const claro = inundar(sementes, (p) => cumulo[p] || (faixa(p) && B(p) - R(p) < 70));
  for (let p = 0; p < N; p++) if (claro[p]) cumulo[p] = 1;
}
{
  const desce = dilatar(cumulo, 6);
  for (let p = 0; p < N; p++) if (desce[p] && colina[p]) cumulo[p] = 1;
}
const SOMBRA = 7;
const distCumulo = distancia(cumulo);
// Azul do céu em volta (canal B, o que mais separa céu de nanquim).
const pesoCeu = Float32Array.from({ length: N }, (_, p) => (ceuAberto[p] && distCumulo[p] > SOMBRA + 2 ? 1 : 0));
const azulCeu = mediaPonderada(Float32Array.from({ length: N }, (_, p) => B(p)), pesoCeu, [6, 16, 48]);
const alfaCumulo = new Float32Array(N);
for (let p = 0; p < N; p++) {
  if (cumulo[p]) {
    alfaCumulo[p] = 1;
    continue;
  }
  const d = distCumulo[p];
  if (d > SOMBRA || colina[p]) continue;
  const escuro = Math.min(1, Math.max(0, (azulCeu[p] - B(p)) / Math.max(20, azulCeu[p] - 10)));
  alfaCumulo[p] = smooth(0.15, 0.85, escuro) * (1 - smooth(SOMBRA * 0.4, SOMBRA, d));
}

// ---------- 4. Nuvens em meio-tom ----------
// Os pontos das nuvens são creme (vermelho perto do azul); os pontos claros
// do céu são azulados. A densidade de pontos creme, borrada, vira a
// máscara: cada nuvem sai com os pontos e o azul entre eles. A borda é
// quase dura (rampa curta): na retícula a emenda some entre os pontos, e
// uma franja translúcida mostraria o céu refeito por baixo.
const livre = (p) => !colina[p] && alfaCumulo[p] === 0 && !solLargo[p];
const creme = Float32Array.from({ length: N }, (_, p) => (livre(p) && R(p) > 120 && R(p) > B(p) - 22 ? 1 : 0));
const densidade = borrar(creme, 4);
const alfaNuvem = new Float32Array(N);
for (let p = 0; p < N; p++) alfaNuvem[p] = livre(p) ? smooth(0.035, 0.07, densidade[p]) : 0;
// Grupos: componentes da máscara; os pequenos vão para o grupo vizinho
// maior (ou somem, se forem só ruído do céu).
const grupos = [];
{
  const { rot, lista } = componentes(Uint8Array.from(alfaNuvem, (a) => (a > 0.02 ? 1 : 0)));
  const ordem = lista.filter((c) => c.area > 1500).sort((a, b) => b.area - a.area);
  const ruido = new Set(lista.filter((c) => c.area <= 1500).map((c) => c.id));
  for (let p = 0; p < N; p++) if (ruido.has(rot[p])) alfaNuvem[p] = 0;
  console.log(
    "componentes de nuvem:",
    ordem.map((c) => `${c.area}px [${c.x0},${c.y0}–${c.x1},${c.y1}]`),
  );
  for (const c of ordem) grupos.push({ ...c, rot });
}

// ---------- 5. Céu ----------
// Tudo que alguma camada cobre é refeito: o tom baixo vem do céu em volta
// (média ponderada em raios crescentes) e a retícula vem de um retalho
// limpo do próprio céu, repetido, com o contraste local do céu em volta.
// Também é refeito o que sobra das franjas das nuvens (pontos creme soltos
// abaixo do limiar do recorte): o céu sai limpo, sem fantasmas de nuvem.
// O sol sai com folga larga: em volta dele o céu original é mais claro
// (brilho dos raios), e no hero o sol sai do lugar.
const solFolga = dilatar(sol, 30);
const cobre = new Float32Array(N);
for (let p = 0; p < N; p++) {
  const franja = densidade[p] > 0.002 && !colina[p] ? 1 : 0;
  cobre[p] = Math.max(colina[p], solFolga[p], alfaCumulo[p] > 0 ? 1 : 0, alfaNuvem[p] > 0 ? 1 : 0, franja);
}
const cobreLargo = dilatar(Uint8Array.from(cobre, (v) => (v > 0 ? 1 : 0)), 6);
const pesoLimpo = Float32Array.from(cobreLargo, (v) => 1 - v);
const RAIOS = [12, 32, 80, 200, 2000];
const canal = (c) => Float32Array.from({ length: N }, (_, p) => src[p * 3 + c]);
const baixo = [0, 1, 2].map((c) => mediaPonderada(canal(c), pesoLimpo, RAIOS));
const lum = Float32Array.from({ length: N }, (_, p) => (src[p * 3] + src[p * 3 + 1] + src[p * 3 + 2]) / 3);
const lumBaixa = mediaPonderada(lum, pesoLimpo, RAIOS);
const desvio2 = mediaPonderada(
  Float32Array.from({ length: N }, (_, p) => (lum[p] - lumBaixa[p]) ** 2),
  pesoLimpo,
  RAIOS,
);
// Retalho: o maior retângulo no alto à esquerda sem nada na frente.
const ret = { w: 0, h: 0 };
{
  const livreAte = new Int32Array(W).fill(H); // 1ª linha coberta de cada coluna
  for (let p = 0; p < N; p++) {
    const x = p % W;
    if (cobreLargo[p] && livreAte[x] === H) livreAte[x] = (p - x) / W;
  }
  for (const h of [100, 130, 160, 200, 240, 280]) {
    let w = 0;
    while (w < W && livreAte[w] >= h) w++;
    if (w * h > ret.w * ret.h) Object.assign(ret, { w, h });
  }
}
// Espelhado nas duas direções: sem emenda dura na repetição.
const noRetalho = (x, y) => {
  const tx = Math.floor(x / ret.w) % 2 ? ret.w - 1 - (x % ret.w) : x % ret.w;
  const ty = Math.floor(y / ret.h) % 2 ? ret.h - 1 - (y % ret.h) : y % ret.h;
  return ty * W + tx;
};
const ceu = Buffer.from(src);
for (let p = 0; p < N; p++) {
  if (!cobreLargo[p]) continue;
  const x = p % W;
  const q = noRetalho(x, (p - x) / W);
  // Contraste do retalho ajustado ao céu em volta, sem passar do original:
  // acima disso a retícula refeita vira manchas claras.
  const ganho = Math.min(1, Math.sqrt(desvio2[p] / Math.max(1, desvio2[q])));
  for (let c = 0; c < 3; c++) {
    const v = baixo[c][p] + (src[q * 3 + c] - baixo[c][q]) * ganho;
    ceu[p * 3 + c] = Math.min(255, Math.max(0, Math.round(v)));
  }
}

// ---------- saída ----------
// smartSubsample: a retícula alterna creme e azul pixel a pixel; o croma
// subamostrado comum borra os pontos.
const WEBP = { quality: 90, alphaQuality: 100, smartSubsample: true, effort: 6 };
await mkdir(destino, { recursive: true });

// Recorte RGBA de uma camada: cor de `fonte`, alfa por pixel, cortado na
// caixa onde alfa > 0. Pixels de borda (alfa < 1) recebem a cor do vizinho
// opaco mais próximo de dentro para não trazer franja do fundo.
async function salvar(nome, fonte, alfa, cor) {
  let x0 = W;
  let y0 = H;
  let x1 = -1;
  let y1 = -1;
  for (let p = 0; p < N; p++) {
    if (alfa[p] <= 0.004) continue;
    const x = p % W;
    const y = (p - x) / W;
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }
  const w = x1 - x0 + 1;
  const h = y1 - y0 + 1;
  const out = Buffer.alloc(w * h * 4);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const p = y * W + x;
      const o = ((y - y0) * w + (x - x0)) * 4;
      const a = alfa[p];
      if (a <= 0.004) continue;
      const rgb = cor ? cor(p) : [fonte[p * 3], fonte[p * 3 + 1], fonte[p * 3 + 2]];
      out[o] = rgb[0];
      out[o + 1] = rgb[1];
      out[o + 2] = rgb[2];
      out[o + 3] = Math.round(a * 255);
    }
  }
  const arquivo = `${nome}.webp`;
  await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .webp(WEBP)
    .toFile(path.join(destino, arquivo));
  console.log(`${arquivo}: ${w}×${h} em (${x0}, ${y0})`);
  return { nome, arquivo, x: x0, y: y0, w, h };
}

const camadas = [];
await sharp(ceu, { raw: { width: W, height: H, channels: 3 } })
  .webp(WEBP)
  .toFile(path.join(destino, "ceu.webp"));
camadas.push({ nome: "ceu", arquivo: "ceu.webp", x: 0, y: 0, w: W, h: H });

// Nuvens: nomeadas da esquerda para a direita.
const porX = [...grupos].sort((a, b) => a.x0 - b.x0 || a.y0 - b.y0);
for (const [i, g] of porX.entries()) {
  const alfa = Float32Array.from(alfaNuvem, (a, p) => (g.rot[p] === g.id ? a : 0));
  camadas.push(await salvar(`nuvem-${i + 1}`, src, alfa));
}

// Sol: borda antisserrilhada (caixa 3×3 da máscara); fora da máscara a cor
// é a do vizinho de dentro.
{
  const alfa = caixaBorrada(Float32Array.from(sol), 1);
  for (let p = 0; p < N; p++) if (sol[p]) alfa[p] = Math.max(alfa[p], 0.75);
  const dentro = (p) => {
    if (sol[p]) return [R(p), G(p), B(p)];
    const x = p % W;
    for (const q of [p - 1, p + 1, p - W, p + W, p - W - 1, p - W + 1, p + W - 1, p + W + 1]) {
      const qx = q % W;
      if (q >= 0 && q < N && Math.abs(qx - x) <= 1 && sol[q]) return [R(q), G(q), B(q)];
    }
    return [R(p), G(p), B(p)];
  };
  camadas.push(await salvar("sol", src, alfa, dentro));
}

// Cúmulos: por dentro, a imagem; na sombra, o preto do nanquim.
camadas.push(await salvar("cumulos", src, alfaCumulo, (p) => (cumulo[p] ? [R(p), G(p), B(p)] : [4, 8, 14])));

camadas.push(await salvar("colinas", src, alfaColina));

const ident = (nome) => nome.replace(/-(\w)/g, (_, c) => c.toUpperCase());
const ts = `// Gerado por scripts/recortar-paisagem.mjs — não edite à mão.
// Caixa de cada camada em px do quadro original (${W}×${H}).
${camadas.map((c) => `import ${ident(c.nome)} from "./${c.arquivo}";`).join("\n")}

export const QUADRO = { w: ${W}, h: ${H} } as const;

export const camadas = {
${camadas.map((c) => `  ${JSON.stringify(c.nome)}: { src: ${ident(c.nome)}, x: ${c.x}, y: ${c.y}, w: ${c.w}, h: ${c.h} },`).join("\n")}
} as const;

export type NomeCamada = keyof typeof camadas;
`;
await writeFile(path.join(destino, "camadas.ts"), ts);
console.log(`retalho do céu: ${ret.w}×${ret.h}; ${camadas.length} camadas → ${destino}`);
