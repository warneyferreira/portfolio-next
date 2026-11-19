"use client";

import { useEffect, useRef } from "react";
import { BAYER8 } from "@/lib/dither";
import s from "./earth.module.css";

/*
 * O planeta do rodapé: a gravura da Terra é amostrada numa grade de células
 * (luminância média por célula) e reimpressa em Canvas2D como dither
 * ordenado Bayer 8×8 em var(--ink) sobre var(--paper) — o mesmo idioma de
 * retícula do resto do site. O "shimmer" é um deslocamento lento do limiar;
 * com "menos movimento" fica um quadro estático.
 */

const SOURCE = "/images/footer/earth-source.webp";
const CELL = 7; // px CSS por célula
const FRAME_MS = 40; // ~25 fps: o suficiente para o shimmer, barato

type Grid = { cols: number; rows: number; lum: Float32Array; cell: number };

export default function EarthCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const styles = getComputedStyle(canvas);
    const ink = styles.getPropertyValue("--ink").trim() || "#c43c00";
    const paper = styles.getPropertyValue("--paper").trim() || "#fef0d3";

    const reduceQuery = matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let disposed = false;
    let lastDraw = 0;
    let grid: Grid | null = null;

    const image = new Image();
    image.decoding = "async";
    image.src = SOURCE;

    const build = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const css = canvas.clientWidth || 280;
      const size = Math.round(css * dpr);
      if (canvas.width !== size) {
        canvas.width = size;
        canvas.height = size;
      }
      const off = document.createElement("canvas");
      off.width = size;
      off.height = size;
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;
      octx.drawImage(image, 0, 0, size, size);
      const { data } = octx.getImageData(0, 0, size, size);
      const cell = Math.max(4, Math.round(CELL * dpr));
      const cols = Math.ceil(size / cell);
      const rows = Math.ceil(size / cell);
      const lum = new Float32Array(cols * rows);
      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          let sum = 0;
          let n = 0;
          const x0 = cx * cell;
          const y0 = cy * cell;
          const x1 = Math.min(size, x0 + cell);
          const y1 = Math.min(size, y0 + cell);
          for (let y = y0; y < y1; y += 2) {
            for (let x = x0; x < x1; x += 2) {
              const i = (y * size + x) * 4;
              sum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
              n++;
            }
          }
          // branco do papel vira 0 (sem poeira); traço cheio vira 1
          lum[cy * cols + cx] = n ? 1 - Math.min(1, Math.max(0, (sum / n - 5) / 250)) : 0;
        }
      }
      grid = { cols, rows, lum, cell };
    };

    const draw = (time: number) => {
      if (!grid) return;
      const { cols, rows, lum, cell } = grid;
      const size = canvas.width;
      ctx.fillStyle = paper;
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = ink;
      const still = reduceQuery.matches;
      const phase = still ? 0 : Math.sin(time * 0.0006) * 0.05;
      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const v = lum[cy * cols + cx];
          if (v <= 0.02) continue;
          const wave = still ? 0 : Math.sin(cy * 0.35 + cx * 0.22 + time * 0.0008) * 0.035;
          const threshold = (BAYER8[cy % 8][cx % 8] + 0.5) / 64;
          if (v > threshold + phase + wave) {
            ctx.fillRect(cx * cell, cy * cell, cell, cell);
          }
        }
      }
    };

    const loop = (time: number) => {
      if (disposed) return;
      if (time - lastDraw > FRAME_MS) {
        draw(time);
        lastDraw = time;
      }
      raf = requestAnimationFrame(loop);
    };

    const restart = () => {
      cancelAnimationFrame(raf);
      if (reduceQuery.matches) draw(performance.now());
      else raf = requestAnimationFrame(loop);
    };

    image.onload = () => {
      build();
      restart();
    };

    const onResize = () => {
      if (!image.complete) return;
      build();
      draw(performance.now());
    };
    window.addEventListener("resize", onResize);
    reduceQuery.addEventListener("change", restart);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      reduceQuery.removeEventListener("change", restart);
    };
  }, []);

  return <canvas ref={ref} className={s.earth} aria-hidden="true" />;
}
