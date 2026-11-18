import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import SmartImage from './SmartImage'
import { angleViews } from '../data/content'

/** Six fixed camera angles. Swipe, click, use the selectors or the arrow keys. */
export default function AngleGallery() {
  const [active, setActive] = useState(0)
  const startX = useRef<number | null>(null)
  const n = angleViews.length
  const go = (i: number) => setActive(((i % n) + n) % n)

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1) }
  }
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    startX.current = e.clientX
  }
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return
    const dx = e.clientX - startX.current
    startX.current = null
    if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1))
  }

  return (
    <div className="angles">
      <div
        className="angles__stage"
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Galaxy S26 Ultra angles. Use left and right arrow keys, or swipe."
        onKeyDown={onKey}
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerCancel={() => (startX.current = null)}
      >
        <div className="angles__track" style={{ '--i': active } as CSSProperties}>
          {angleViews.map((a, i) => (
            <button
              type="button"
              key={a.id}
              tabIndex={-1}
              className={`angles__item ${i === active ? 'is-active' : ''}`}
              onClick={() => go(i)}
              aria-hidden={i !== active}
            >
              <SmartImage className="shot--feather" src={a.image.src} width={a.image.width} height={a.image.height} alt={a.alt} />
            </button>
          ))}
        </div>
      </div>

      <div className="angles__meta">
        <p className="angles__count" aria-live="polite">
          {angleViews[active].label} <span>{active + 1} / {n}</span>
        </p>
        <div className="angles__selectors" role="group" aria-label="Choose an angle">
          {angleViews.map((a, i) => (
            <button key={a.id} type="button" className="chip" aria-pressed={i === active} onClick={() => go(i)}>
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
