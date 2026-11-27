"use client";

import { useSyncExternalStore } from "react";

/* Tema da /alternative: escuro (padrão, fundo preto) ou claro (branco
   pastel). Fica em html[data-alt-tema] — aplicado antes da primeira pintura
   por TEMA_BOOT (boot.ts) — e é guardado no localStorage. As cores moram
   nos tokens do .root (alternative.module.css); os canvas leem as deles
   das variáveis --alt-*-rgb com corDe() e se atualizam com observarTema(). */

export type Tema = "escuro" | "claro";

const CHAVE = "alt-tema";

export const temaAtual = (): Tema =>
  document.documentElement.dataset.altTema === "claro" ? "claro" : "escuro";

export function definirTema(tema: Tema) {
  document.documentElement.dataset.altTema = tema;
  try {
    localStorage.setItem(CHAVE, tema);
  } catch {}
}

export function observarTema(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-alt-tema"] });
  return () => mo.disconnect();
}

export const useTema = (): Tema => useSyncExternalStore(observarTema, temaAtual, () => "escuro");

// "r g b" (0–255) de uma variável CSS → [r, g, b] de 0 a 1.
export function corDe(el: Element, nome: string, reserva: [number, number, number]): [number, number, number] {
  const v = getComputedStyle(el).getPropertyValue(nome).trim().split(/\s+/).map(Number);
  return v.length === 3 && v.every(Number.isFinite) ? [v[0] / 255, v[1] / 255, v[2] / 255] : reserva;
}
