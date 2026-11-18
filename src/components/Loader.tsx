import { useEffect, useState } from 'react'
import { assets } from '../assets'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface LoaderProps {
  onDone: () => void
}

function preload(src?: string): Promise<void> {
  if (!src) return Promise.resolve()
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = src
  })
}

export default function Loader({ onDone }: LoaderProps) {
  const reduced = useReducedMotion()
  const [leaving, setLeaving] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    let cancelled = false
    const min = new Promise<void>((r) => window.setTimeout(r, reduced ? 150 : 1100))
    const fonts = document.fonts?.ready ?? Promise.resolve()
    const timeout = new Promise<void>((r) => window.setTimeout(r, 4000))
    Promise.race([Promise.all([min, fonts, preload(assets.hero.src)]), timeout]).then(() => {
      if (cancelled) return
      setLeaving(true)
      onDone()
      window.setTimeout(() => !cancelled && setGone(true), reduced ? 0 : 900)
    })
    return () => {
      cancelled = true
    }
  }, [onDone, reduced])

  if (gone) return null
  return (
    <div className={`loader ${leaving ? 'is-leaving' : ''}`} role="status" aria-live="polite" aria-label="Loading Galaxy S26 Ultra">
      <div className="loader__mark">Samsung</div>
      <div className="loader__bar" aria-hidden="true"><span /></div>
    </div>
  )
}
