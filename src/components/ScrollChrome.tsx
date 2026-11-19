import { useEffect, useRef } from 'react'
import { ArrowUp } from 'lucide-react'
import { ScrollTrigger } from '../lib/gsap'
import { scrollToTop } from '../lib/smooth'

/** Scroll progress bar + back-to-top control. Updates the DOM directly: no React re-renders while scrolling. */
export default function ScrollChrome() {
  const bar = useRef<HTMLDivElement>(null)
  const top = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`
        top.current?.classList.toggle('is-visible', self.scroll() > window.innerHeight * 0.8)
      },
    })
    return () => st.kill()
  }, [])

  return (
    <>
      <div className="progress" aria-hidden="true"><div ref={bar} className="progress__bar" /></div>
      <button ref={top} type="button" className="to-top" onClick={scrollToTop} aria-label="Back to top">
        <ArrowUp size={20} aria-hidden="true" />
      </button>
    </>
  )
}
