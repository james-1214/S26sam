import { useEffect, useRef, useState } from 'react'
import { BRAND } from '../data/brand'
import { gsap } from '../lib/gsap'
import { webglAvailable } from '../lib/device'
import { modelReady } from '../lib/ready'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface LoaderProps {
  onDone: () => void
}

const LAYERS = 6
const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))

/**
 * Loading sequence. The counter and the layer stack are driven by REAL readiness
 * (fonts, the 3D chunk, the first model build) plus a minimum showtime; the layers converge into one phone,
 * then a curtain lifts and the hero intro (and the 3D assemble) starts underneath it.
 */
export default function Loader({ onDone }: LoaderProps) {
  const reduced = useReducedMotion()
  const root = useRef<HTMLDivElement>(null)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const el = root.current
    if (!el) return
    let cancelled = false
    const gl = webglAvailable()
    const count = el.querySelector<HTMLElement>('.loader__count')!
    const layers = gsap.utils.toArray<HTMLElement>('.loader__layer', el)
    const state = { p: 0 }
    const render = () => { count.textContent = String(Math.round(state.p)).padStart(3, '0') }

    // scrubbed by progress: the layers fan out, then converge into one assembled phone
    const stack = gsap.timeline({ paused: true, defaults: { ease: 'none' } })
    if (!reduced) {
      stack.fromTo(layers, { y: (i: number) => (i - (LAYERS - 1) / 2) * 34, opacity: 0.25, scale: 1.08 }, { y: 0, opacity: 1, scale: 1, stagger: 0.02, duration: 1 }, 0)
        .fromTo('.loader__bar span', { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)
      gsap.fromTo('.loader__mark span', { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.06, ease: 'expo.out' })
    }

    let done = 0
    const bump = (w: number) => {
      done = Math.min(100, done + w)
      gsap.to(state, { p: done, duration: reduced ? 0 : 0.7, ease: 'power2.out', overwrite: true, onUpdate: () => { render(); stack.progress(state.p / 100) } })
    }
    const task = (p: Promise<unknown>, w: number) => p.catch(() => undefined).then(() => !cancelled && bump(w))

    const finish = async () => {
      await Promise.all([
        task(document.fonts?.ready ?? Promise.resolve(), 20),
        task(import('../three/PhoneStageImpl'), 30),
        task(gl ? Promise.race([modelReady, wait(4500)]) : Promise.resolve(), 35),
        task(wait(reduced ? 150 : 1500), 15),
      ])
      if (cancelled) return
      await wait(reduced ? 0 : 350)
      if (cancelled) return
      if (reduced) { onDone(); setGone(true); return }
      gsap.timeline({ onComplete: () => !cancelled && setGone(true) })
        .to('.loader__inner', { y: -24, opacity: 0, duration: 0.5, ease: 'power2.in' }, 0)
        .call(onDone, undefined, 0.35)
        .to(el, { clipPath: 'inset(0 0 100% 0)', duration: 0.95, ease: 'power4.inOut' }, 0.3)
    }
    void finish()
    return () => { cancelled = true; stack.kill(); gsap.killTweensOf([state, '.loader__mark span']) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  if (gone) return null
  return (
    <div ref={root} className="loader" role="status" aria-live="polite" aria-label={`Loading ${BRAND.product}`}>
      <div className="loader__inner">
        <div className="loader__phone" aria-hidden="true">
          {Array.from({ length: LAYERS }, (_, i) => <i key={i} className="loader__layer" style={{ zIndex: i }} />)}
        </div>
        <div className="loader__mark" aria-hidden="true">{BRAND.mark.split('').map((c, i) => <span key={i}>{c}</span>)}</div>
        <div className="loader__bar" aria-hidden="true"><span /></div>
        <p className="loader__count" aria-hidden="true">000</p>
      </div>
    </div>
  )
}
