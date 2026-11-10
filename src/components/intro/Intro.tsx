"use client"

import * as React from "react"
import BrandMark, { MARK_SVG } from "@/components/brand/BrandMark"
import { GlassIconReveal } from "@/components/ui/liquid-glass-logo-reveal"
import s from "./intro.module.css"

const INK = "#c43c00"
const PAPER = "#fef0d3"
const FLIGHT_MS = 780

type Rect = { x: number; y: number; w: number; h: number }

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

/* A abertura: o vidro revela a marca no papel, e ao fim a marca desliza
   até a barra. O véu é opaco, então a página só aparece quando ele sai. */
export default function Intro() {
  const [gone, setGone] = React.useState(false)
  const [flight, setFlight] = React.useState<{ from: Rect; to: Rect } | null>(null)
  const [launched, setLaunched] = React.useState(false)
  const finished = React.useRef(false)

  const finish = React.useCallback(() => {
    if (finished.current) return
    finished.current = true
    document.documentElement.dataset.intro = "done"
    setGone(true)
  }, [])

  // Sem movimento: a abertura não existe, a barra já nasce com a marca.
  React.useEffect(() => {
    if (reduced()) finish()
  }, [finish])

  // Enquanto o véu está de pé a página não rola por baixo dele.
  React.useEffect(() => {
    if (gone) return
    const block = (e: Event) => e.preventDefault()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish()
    }
    window.addEventListener("wheel", block, { passive: false })
    window.addEventListener("touchmove", block, { passive: false })
    window.addEventListener("keydown", onKey)
    // Rede de segurança: sem WebGL, ou com a marca que não carrega, onEnd nunca vem.
    const failsafe = window.setTimeout(finish, 7000)
    return () => {
      window.removeEventListener("wheel", block)
      window.removeEventListener("touchmove", block)
      window.removeEventListener("keydown", onKey)
      clearTimeout(failsafe)
    }
  }, [gone, finish])

  const handoff = React.useCallback(
    (size: number) => {
      if (finished.current) return
      const mark = document.querySelector<SVGElement>("[data-brand-mark]")
      const r = mark?.getBoundingClientRect()
      if (!r || !r.width) {
        finish()
        return
      }
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const veil = document.querySelector<HTMLElement>("[data-intro-veil]")?.getBoundingClientRect()
      const ox = veil ? veil.left + veil.width / 2 : cx
      const oy = veil ? veil.top + veil.height / 2 : cy
      setFlight({
        from: { x: ox - size / 2, y: oy - size / 2, w: size, h: size },
        to: { x: r.left, y: r.top, w: r.width, h: r.height },
      })
    },
    [finish],
  )

  React.useEffect(() => {
    if (!flight) return
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setLaunched(true))
    })
    const land = window.setTimeout(finish, FLIGHT_MS + 60)
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
      clearTimeout(land)
    }
  }, [flight, finish])

  if (gone) return null

  const dx = flight ? flight.to.x + flight.to.w / 2 - (flight.from.x + flight.from.w / 2) : 0
  const dy = flight ? flight.to.y + flight.to.h / 2 - (flight.from.y + flight.from.h / 2) : 0
  const scale = flight ? flight.to.w / flight.from.w : 1

  return (
    <>
      <div className={s.veil} data-intro-veil data-leaving={flight ? "" : undefined}>
        <GlassIconReveal
          logo={MARK_SVG}
          label="Warney Rego"
          look="light"
          background={PAPER}
          logoColor={INK}
          logoScale={0.62}
          finalScale={0.8}
          tileSize={440}
          loop={false}
          hold={0}
          onEnd={handoff}
          style={{ position: "absolute", inset: 0 }}
          tuning={{
            // Uma tinta só: o vidro dobra a marca, mas não separa cor.
            dispersion: 0,
            colorBleed: 0,
            glide: 1.5,
            present: 1.2,
            startZoom: 2.3,
          }}
        />
        <button type="button" className={s.skip} onClick={finish}>
          Pular
        </button>
      </div>
      {flight && (
        <div
          className={s.clone}
          style={{
            left: flight.from.x,
            top: flight.from.y,
            width: flight.from.w,
            height: flight.from.h,
            transform: launched ? `translate(${dx}px, ${dy}px) scale(${scale})` : "none",
          }}
        >
          <BrandMark />
        </div>
      )}
    </>
  )
}
