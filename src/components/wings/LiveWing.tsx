"use client";

import { useEffect, useRef, useSyncExternalStore, type CSSProperties } from "react";
import { fragmentShader, type Rig } from "./rig";
import s from "./wings.module.css";

/*
 * Uma ala viva: a mesma máscara 1 bit redesenhada em WebGL com as asas do
 * rig girando em torno da raiz. O span continua sendo a ala
 * estática; só quando o primeiro quadro está pronto ele ganha data-live e
 * a máscara CSS dá lugar à tela, já na pose de repouso. Movimento reduzido,
 * WebGL ausente ou contexto perdido deixam a ala estática. Fora da tela, o
 * laço para.
 */

const FRAME_MS = 1000 / 30;
const REDUCE = "(prefers-reduced-motion: reduce)";

const VERTEX = `attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }`;

function subscribeReduce(onChange: () => void) {
  const query = matchMedia(REDUCE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  console.warn("LiveWing:", gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}

type Props = {
  className: string;
  style: CSSProperties;
  src: string;
  anchor: "top" | "center" | "bottom";
  side: "left" | "right";
  rig: Rig;
};

export default function LiveWing({ className, style, src, anchor, side, rig }: Props) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useSyncExternalStore(subscribeReduce, () => matchMedia(REDUCE).matches, () => true);

  useEffect(() => {
    const span = spanRef.current;
    const canvas = canvasRef.current;
    if (reduced || !span || !canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      // O quadro desenhado antes da troca precisa sobreviver até aparecer.
      preserveDrawingBuffer: true,
    });
    if (!gl) return;

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentShader(rig));
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    // Um triângulo que cobre a tela inteira.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const uniform = (name: string) => gl.getUniformLocation(program, name);
    const uCanvas = uniform("u_canvas");
    const uOrigin = uniform("u_origin");
    const uScale = uniform("u_scale");
    const uSize = uniform("u_size");
    const uTime = uniform("u_time");
    gl.uniform1i(uniform("u_art"), 0);

    // A tinta é a cor de fundo da ala estática, lida antes da troca.
    const [r, g, b] = (getComputedStyle(span).backgroundColor.match(/\d+(\.\d+)?/g) ?? ["0", "0", "0"]).map(Number);
    gl.uniform3f(uniform("u_ink"), r / 255, g / 255, b / 255);

    const image = new Image();
    const scratch = document.createElement("canvas");
    let ready = false;
    let visible = false;
    let raf = 0;
    let last = 0;
    let elapsed = 0;

    const draw = () => {
      gl.uniform1f(uTime, elapsed);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    // Mesmo enquadramento da máscara CSS: contain na margem, largura
    // inteira na vinheta do celular (--fit em wings.module.css).
    const layout = () => {
      if (!ready) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = span.clientWidth;
      const height = span.clientHeight;
      const fit = getComputedStyle(span).getPropertyValue("--fit").trim();
      const iw = image.naturalWidth;
      const ih = image.naturalHeight;
      const scale = fit === "width" ? width / iw : Math.min(width / iw, height / ih);
      const artWidth = iw * scale;
      const artHeight = ih * scale;
      const x = side === "left" ? 0 : width - artWidth;
      const y = fit === "width" || anchor === "top" ? 0 : anchor === "bottom" ? height - artHeight : (height - artHeight) / 2;

      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      // A textura sai no tamanho de tela: reduzir antes evita serrilhado
      // nas hachuras e deixa a pose de repouso igual à máscara CSS.
      scratch.width = Math.max(1, Math.round(artWidth * dpr));
      scratch.height = Math.max(1, Math.round(artHeight * dpr));
      const context = scratch.getContext("2d");
      if (!context) return;
      context.imageSmoothingQuality = "high";
      context.clearRect(0, 0, scratch.width, scratch.height);
      context.drawImage(image, 0, 0, scratch.width, scratch.height);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, scratch);

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uCanvas, canvas.width, canvas.height);
      gl.uniform2f(uOrigin, Math.round(x * dpr), Math.round(y * dpr));
      gl.uniform1f(uScale, scratch.width / iw);
      gl.uniform2f(uSize, iw, ih);
      draw();
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!last) last = now;
      if (now - last < FRAME_MS) return;
      elapsed += Math.min(now - last, 100) / 1000;
      last = now;
      draw();
    };

    const start = () => {
      if (raf || !ready || !visible) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onLost = (event: Event) => {
      event.preventDefault();
      stop();
      ready = false;
      span.removeAttribute("data-live");
    };

    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { rootMargin: "120px" },
    );
    const resize = new ResizeObserver(layout);

    image.decoding = "async";
    image.onload = () => {
      ready = true;
      layout();
      span.setAttribute("data-live", "");
      start();
    };
    image.src = src;
    canvas.addEventListener("webglcontextlost", onLost);
    intersection.observe(span);
    resize.observe(span);

    return () => {
      image.onload = null;
      stop();
      intersection.disconnect();
      resize.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      span.removeAttribute("data-live");
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, [reduced, src, anchor, side, rig]);

  return (
    <span ref={spanRef} className={className} style={style}>
      <canvas ref={canvasRef} className={s.canvas} />
    </span>
  );
}
