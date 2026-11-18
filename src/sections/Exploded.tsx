import { useRef } from 'react'
import SmartImage from '../components/SmartImage'
import { assets } from '../assets'
import { EXPLODED_CROP as C, explodedRegions } from '../data/content'
import { gsap } from '../lib/gsap'
import { sequence } from '../lib/sequence'
import { useScrollScene } from '../hooks/useScrollScene'

const boxOf = (r: { x: number; y: number; w: number; h: number }) => ({
  left: `${(r.x / C.size) * 100}%`,
  top: `${((r.y - C.top) / C.height) * 100}%`,
  width: `${(r.w / C.size) * 100}%`,
  height: `${(r.h / C.height) * 100}%`,
})

export default function Exploded() {
  const root = useRef<HTMLElement>(null)

  useScrollScene(root, ({ isDesktop }) => {
    const all = <T extends Element>(sel: string) => gsap.utils.toArray<T>(sel, root.current!)
    const captions = all('.exp__caption')
    const chips = all('.exp__chip')

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root.current,
        start: 'top top',
        end: isDesktop ? '+=400%' : '+=280%',
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })

    // The graphic is a flattened image: components are revealed with masks and emphasis, not moved apart.
    gsap.set('.exp__heading', { autoAlpha: 0, y: 30 })
    gsap.set('.exp__assembled', { autoAlpha: 0, scale: 0.88 })
    gsap.set('.exp__image', { autoAlpha: 0, scale: 0.92, clipPath: 'inset(0% 50% 0% 50%)' })
    gsap.set('.exp__spot', { autoAlpha: 0, ...boxOf(explodedRegions[0]) })
    gsap.set(chips, { opacity: 0.35 })

    tl.to('.exp__heading', { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0)
      .to('.exp__assembled', { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'power2.out' }, 0.2)
      // phone "opens"
      .to('.exp__assembled', { scale: 1.18, autoAlpha: 0, duration: 0.9, ease: 'power2.in' }, 1)
      .to('.exp__image', { autoAlpha: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power2.inOut' }, 1.1)
      .to('.exp__heading', { y: isDesktop ? -6 : 0, duration: 1 }, 1.1)

    // Emphasis: the spotlight travels between regions while captions and chips stay in sync
    const start = 2.4
    const gap = 1.2
    tl.to('.exp__spot', { autoAlpha: 1, duration: 0.4 }, start - 0.3)
    explodedRegions.forEach((r, i) => {
      const t = start + i * gap
      if (i > 0) tl.to('.exp__spot', { ...boxOf(r), duration: 0.6, ease: 'power2.inOut' }, t)
      tl.to(chips[i], { opacity: 1, duration: 0.3 }, t)
      if (i < explodedRegions.length - 1) tl.to(chips[i], { opacity: 0.35, duration: 0.3 }, t + gap)
    })
    sequence(tl, captions, { at: start, gap, hidden: { autoAlpha: 0, y: 18 }, shown: { autoAlpha: 1, y: 0 } })
    gsap.set(captions[0], { autoAlpha: 0 })
    tl.to(captions[0], { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, start - 0.1)

    // Hand-off to the anatomy section
    const end = start + explodedRegions.length * gap
    tl.to('.exp__spot', { autoAlpha: 0, duration: 0.4 }, end - 0.2)
      .to('.exp__frame', { opacity: 0.35, scale: 0.97, duration: 0.8 }, end)
      .to('.exp__rail', { opacity: 0, duration: 0.5 }, end)
  })

  const front = assets.front
  return (
    <section id="inside" ref={root} className="pin exp" aria-labelledby="inside-title">
      <h2 id="inside-title" className="h2 exp__heading">Open it up.</h2>

      <div className="exp__body">
        <div className="exp__frame">
          <div className="exp__assembled">
            <SmartImage className="shot--tight" src={front.src} width={front.width} height={front.height} alt="Assembled Galaxy S26 Ultra" />
          </div>
          <div className="exp__image">
            <SmartImage
              className="exp__img"
              src={assets.exploded.src}
              width={assets.exploded.width}
              height={assets.exploded.height}
              alt="Exploded view of the Galaxy S26 Ultra showing the back panel, camera module, shielding, mainboard, battery, vapor chamber, internal frame, display and S Pen"
            />
            <div className="exp__spot" aria-hidden="true" />
          </div>
        </div>

        <div className="exp__rail">
          <ul className="exp__chips" aria-label="Components">
            {explodedRegions.map((r) => (
              <li key={r.id} className="exp__chip">{r.label}</li>
            ))}
          </ul>
          <div className="exp__captions" aria-live="polite">
            {explodedRegions.map((r) => (
              <div key={r.id} className="exp__caption">
                <h3 className="h3">{r.label}</h3>
                <p className="lead">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
