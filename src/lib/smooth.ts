import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

let lenis: Lenis | null = null
let tick: ((time: number) => void) | null = null

export function startSmoothScroll(): void {
  if (lenis) return
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  tick = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
}

export function stopSmoothScroll(): void {
  if (tick) gsap.ticker.remove(tick)
  lenis?.destroy()
  lenis = null
  tick = null
}

export function lockScroll(locked: boolean): void {
  if (!lenis) return
  if (locked) lenis.stop()
  else lenis.start()
}

const prefersReduced = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function jumpTo(top: number): void {
  if (lenis) lenis.scrollTo(top, { duration: 1.4, easing: (t: number) => 1 - Math.pow(1 - t, 4) })
  else window.scrollTo({ top, behavior: prefersReduced() ? 'auto' : 'smooth' })
}

/** Scroll to a section. Uses the ScrollTrigger start so pinned sections resolve correctly. */
export function scrollToSection(id: string): void {
  const el = document.getElementById(id)
  if (!el) return
  const trigger = ScrollTrigger.getAll().find((st) => st.trigger === el && st.pin)
  const top = trigger ? trigger.start : el.getBoundingClientRect().top + window.scrollY
  jumpTo(top)
}

export function scrollToTop(): void {
  jumpTo(0)
}
