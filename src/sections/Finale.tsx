import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import PhoneStage from '../three/PhoneStage'
import { useExplodeController } from '../three/useExplode'
import { BRAND } from '../data/brand'
import { gsap } from '../lib/gsap'
import { useScrollScene } from '../hooks/useScrollScene'

export default function Finale() {
  const root = useRef<HTMLElement>(null)
  const controller = useExplodeController()

  useScrollScene(root, ({ isDesktop }) => {
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root.current,
        start: 'top top',
        end: isDesktop ? '+=260%' : '+=200%',
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })

    gsap.set('.fin__phone', { opacity: 0, scale: 0.8 })
    gsap.set('.fin__line > span', { yPercent: 115 })
    gsap.set(['.fin__desc', '.fin__cta'], { opacity: 0, y: 20 })

    // 1. the phone rises into the centre
    tl.to('.fin__phone', { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, 0.2)
      // 4-6. headline, description, call to action
      .to('.fin__line > span', { yPercent: 0, duration: 0.7, stagger: 0.2, ease: 'power3.out' }, 2.2)
      .to('.fin__desc', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 2.9)
      .to('.fin__cta', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 3.3)
      .to({}, { duration: 0.7 })
  })

  return (
    <section id="finale" ref={root} className="pin fin" aria-labelledby="finale-title">
      <div className="fin__content">
        <div className="fin__phone">
          <PhoneStage controller={controller} autoRotate initialView="iso" />
        </div>
        <h2 id="finale-title" className="h2 fin__title">
          <span className="fin__line"><span>All of it,</span></span>
          <span className="fin__line"><span>in one hand.</span></span>
        </h2>
        <p className="lead fin__desc">Camera, display, stylus and silicon, assembled into a single object.</p>
        <a className="btn fin__cta" href={BRAND.orderUrl}>
          {BRAND.cta.label} <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
