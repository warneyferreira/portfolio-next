"use client"

import * as React from "react"
import BrandMark, { MARK_SVG } from "@/components/gravura/brand/BrandMark"
import { GlassIconReveal } from "@/components/gravura/ui/liquid-glass-logo-reveal"
import s from "./intro.module.css"

const INK = "#c43c00"
const PAPER = "#fef0d3"
type Rect = { x: number; y: number; w: number; h: number }

const getPlaying = () => document.documentElement.dataset.intro === "playing"
const getServerPlaying = () => false

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-intro"] })
  return () => observer.disconnect()
}

function finish() {
  delete document.documentElement.dataset.intro
}

export default function Intro() {
  const playing = React.useSyncExternalStore(subscribe, getPlaying, getServerPlaying)
  const [flight, setFlight] = React.useState<{ from: Rect; to: Rect } | null>(null)
  const clone = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!playing) return
    const block = (e: Event) => e.preventDefault()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Tab") finish()
    }
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onMotion = () => { if (motion.matches) finish() }
    window.addEventListener("wheel", block, { passive: false })
    window.addEventListener("touchmove", block, { passive: false })
    window.addEventListener("keydown", onKey)
    motion.addEventListener("change", onMotion)
    return () => {
      window.removeEventListener("wheel", block)
      window.removeEventListener("touchmove", block)
      window.removeEventListener("keydown", onKey)
      motion.removeEventListener("change", onMotion)
    }
  }, [playing])

  const handoff = React.useCallback(
    (size: number) => {
      if (!getPlaying()) return
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
    [],
  )

  React.useEffect(() => {
    if (!playing || !flight || !clone.current) return
    const { from, to } = flight
    const dx = to.x + to.w / 2 - (from.x + from.w / 2)
    const dy = to.y + to.h / 2 - (from.y + from.h / 2)
    const animation = clone.current.animate([
      { transform: "none" },
      { transform: `translate(${dx}px, ${dy}px) scale(${to.w / from.w})` },
    ], { duration: 500, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "forwards" })
    animation.finished.then(finish, () => {})
    return () => animation.cancel()
  }, [flight, playing])

  return (
    <>
      <div className={s.veil} data-intro-veil data-leaving={flight ? "" : undefined}>
        {playing && !flight && <GlassIconReveal
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
          speed={1.7}
          onEnd={handoff}
          onUnavailable={finish}
          style={{ position: "absolute", inset: 0 }}
          tuning={{
            // Uma tinta só: o vidro dobra a marca, mas não separa cor.
            dispersion: 0,
            colorBleed: 0,
            glide: 1.5,
            present: 1.2,
            startZoom: 2.3,
          }}
        />}
        <button type="button" className={s.skip} onClick={finish}>
          Pular
        </button>
      </div>
      {playing && flight && (
        <div
          ref={clone}
          className={s.clone}
          style={{
            left: flight.from.x,
            top: flight.from.y,
            width: flight.from.w,
            height: flight.from.h,
          }}
        >
          <BrandMark />
        </div>
      )}
    </>
  )
}
