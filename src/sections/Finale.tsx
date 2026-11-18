import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import SmartImage from '../components/SmartImage'
import { assets } from '../assets'
import { CTA_URL } from '../data/content'
import { gsap } from '../lib/gsap'
import { useScrollScene } from '../hooks/useScrollScene'

export default function Finale() {
  const root = useRef<HTMLElement>(null)

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

    gsap.set('.fin__anatomy', { opacity: 0.5, scale: 1 })
    gsap.set('.fin__exploded', { opacity: 0, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' })
    gsap.set('.fin__phone', { opacity: 0, scale: 0.8 })
    gsap.set('.fin__line > span', { yPercent: 115 })
    gsap.set(['.fin__desc', '.fin__cta'], { opacity: 0, y: 20 })

    // 1. anatomy visuals fade away, exploded view takes over
    tl.to('.fin__anatomy', { opacity: 0, scale: 1.06, duration: 0.9 }, 0)
      .to('.fin__exploded', { opacity: 0.85, duration: 0.7 }, 0.2)
      // 2. exploded view collapses into the assembled phone
      .to('.fin__exploded', { scale: 0.55, opacity: 0, clipPath: 'inset(0% 36% 0% 36%)', duration: 1, ease: 'power2.in' }, 1)
      // 3. phone appears in the centre
      .to('.fin__phone', { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }, 1.3)
      // 4-6. headline, description, call to action
      .to('.fin__line > span', { yPercent: 0, duration: 0.7, stagger: 0.2, ease: 'power3.out' }, 2.2)
      .to('.fin__desc', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 2.9)
      .to('.fin__cta', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 3.3)
      .to({}, { duration: 0.7 })
  })

  const { exploded, anatomy, hero } = assets
  return (
    <section id="finale" ref={root} className="pin fin" aria-labelledby="finale-title">
      <div className="fin__layers" aria-hidden="true">
        <SmartImage className="fin__anatomy" src={anatomy.src} width={anatomy.width} height={anatomy.height} alt="" />
        <SmartImage className="fin__exploded" src={exploded.src} width={exploded.width} height={exploded.height} alt="" />
      </div>

      <div className="fin__content">
        <div className="fin__phone">
          <SmartImage className="shot--tight" src={hero.src} width={hero.width} height={hero.height} alt="Samsung Galaxy S26 Ultra" />
        </div>
        <h2 id="finale-title" className="h2 fin__title">
          <span className="fin__line"><span>All of it,</span></span>
          <span className="fin__line"><span>in one hand.</span></span>
        </h2>
        <p className="lead fin__desc">Camera, display, pen and silicon, assembled into a single object.</p>
        <a className="btn fin__cta" href={CTA_URL} target="_blank" rel="noopener noreferrer">
          Visit Samsung.com <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
