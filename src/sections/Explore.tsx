import { useRef } from 'react'
import AnatomyExplorer from '../components/AnatomyExplorer'
import AngleGallery from '../components/AngleGallery'
import { gsap } from '../lib/gsap'
import { useScrollScene } from '../hooks/useScrollScene'

export default function Explore() {
  const root = useRef<HTMLElement>(null)

  useScrollScene(root, ({ isDesktop }) => {
    gsap.utils.toArray<HTMLElement>('[data-reveal]', root.current!).forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: isDesktop ? 48 : 24,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
      })
    })
  })

  return (
    <section id="explore" ref={root} className="explore" aria-labelledby="explore-title">
      <header className="explore__head" data-reveal>
        <h2 id="explore-title" className="h2">Every part, every angle.</h2>
        <p className="lead">Pick a view to zoom into the anatomy of the phone.</p>
      </header>
      <div data-reveal>
        <AnatomyExplorer />
      </div>

      <header className="explore__head explore__head--second" data-reveal>
        <h2 className="h2 h2--sm">Turn it around.</h2>
        <p className="lead">Six angles of the same phone. Swipe, tap or use the arrow keys.</p>
      </header>
      <div data-reveal>
        <AngleGallery />
      </div>
    </section>
  )
}
