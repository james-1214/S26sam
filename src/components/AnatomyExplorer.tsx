import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import SmartImage from './SmartImage'
import { assets } from '../assets'
import { anatomyViews } from '../data/content'
import { gsap } from '../lib/gsap'

const W = assets.anatomy.width
const H = assets.anatomy.height

/** Zooms into regions of galaxy-anatomy.png. Tabs are keyboard accessible (arrow keys, Home, End). */
export default function AnatomyExplorer() {
  const [active, setActive] = useState(0)
  const [frameW, setFrameW] = useState(0)
  const frame = useRef<HTMLDivElement>(null)
  const layer = useRef<HTMLDivElement>(null)
  const prev = useRef(active)
  const tabs = useRef<Array<HTMLButtonElement | null>>([])

  useEffect(() => {
    const el = frame.current
    if (!el) return
    const ro = new ResizeObserver(() => setFrameW(el.clientWidth))
    ro.observe(el)
    setFrameW(el.clientWidth)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const el = layer.current
    if (!el || !frameW) return
    const r = anatomyViews[active]
    const s = Math.min(W / r.w, H / r.h)
    const k = frameW / W
    const fh = (frameW * H) / W
    const x = frameW / 2 - s * (r.x + r.w / 2) * k
    const y = fh / 2 - s * (r.y + r.h / 2) * k
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const instant = reduced || prev.current === active
    prev.current = active
    const tween = gsap.to(el, { x, y, scale: s, duration: instant ? 0 : 0.95, ease: 'power3.inOut', overwrite: 'auto' })
    return () => {
      tween.kill()
    }
  }, [active, frameW])

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const n = anatomyViews.length
    let next = active
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (active + 1) % n
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (active - 1 + n) % n
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = n - 1
    else return
    e.preventDefault()
    setActive(next)
    tabs.current[next]?.focus()
  }

  const view = anatomyViews[active]
  return (
    <div className="anatomy">
      <div className="anatomy__tabs" role="tablist" aria-label="Anatomy views" onKeyDown={onKey}>
        {anatomyViews.map((v, i) => (
          <button
            key={v.id}
            ref={(el) => {
              tabs.current[i] = el
            }}
            role="tab"
            type="button"
            id={`anatomy-tab-${v.id}`}
            aria-selected={i === active}
            aria-controls="anatomy-panel"
            tabIndex={i === active ? 0 : -1}
            className="chip"
            onClick={() => setActive(i)}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div id="anatomy-panel" role="tabpanel" aria-labelledby={`anatomy-tab-${view.id}`} className="anatomy__panel">
        <div ref={frame} className="anatomy__frame">
          <div ref={layer} className="anatomy__layer">
            <SmartImage src={assets.anatomy.src} width={W} height={H} alt="Annotated anatomy of the Galaxy S26 Ultra: front, back, side and internal views, with a parts list" />
          </div>
        </div>
        <div className="anatomy__copy" aria-live="polite">
          <h3 className="h3">{view.label}</h3>
          <p className="lead">{view.body}</p>
        </div>
      </div>
    </div>
  )
}
