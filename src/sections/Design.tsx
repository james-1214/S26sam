import { useRef } from 'react'
import SmartImage from '../components/SmartImage'
import { assets } from '../assets'
import { designPanels, designPenCaption } from '../data/content'
import { gsap } from '../lib/gsap'
import { sequence } from '../lib/sequence'
import { useScrollScene } from '../hooks/useScrollScene'

export default function Design() {
  const root = useRef<HTMLElement>(null)

  useScrollScene(root, ({ isDesktop }) => {
    const all = <T extends Element>(sel: string) => gsap.utils.toArray<T>(sel, root.current!)
    const shots = all('.design__shot')
    const captions = all('.design__caption')
    const slide = isDesktop ? 7 : 3

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root.current,
        start: 'top top',
        end: isDesktop ? '+=320%' : '+=240%',
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })

    gsap.set('.design__glow--b', { opacity: 0 })
    gsap.set('.design__pen', { opacity: 0.0 })

    // Phone views: scale + position changes between states (flat images: cross-fade, never a fake rotation)
    sequence(tl, shots, {
      gap: 1,
      hidden: { autoAlpha: 0, scale: 0.9, xPercent: slide },
      shown: { autoAlpha: 1, scale: 1, xPercent: 0 },
    })
    // Captions: text reveal in lock-step with the views (+ one for the S Pen)
    sequence(tl, captions, {
      gap: 1,
      hidden: { autoAlpha: 0, y: 24 },
      shown: { autoAlpha: 1, y: 0 },
    })

    // Background lighting transition
    tl.to('.design__glow--a', { opacity: 0, duration: 1 }, 0.6)
      .to('.design__glow--b', { opacity: 1, duration: 1 }, 0.6)
      .to('.design__glow--b', { opacity: 0.55, duration: 1 }, 2.2)

    // S Pen: floats through the whole scene (parallax), then steps forward
    tl.fromTo('.design__pen', { y: isDesktop ? 90 : 40, opacity: 0, rotate: 6 }, { y: 0, opacity: 0.55, rotate: 4, duration: 1.4 }, 0)
      .to('.design__pen', { y: isDesktop ? -50 : -20, duration: 2 }, 1.4)
      .to('.design__pen', { opacity: 1, scale: isDesktop ? 1.25 : 1.1, rotate: 0, duration: 1 }, 2.9)
      .to('.design__shot--side', { autoAlpha: 0.25, duration: 1 }, 3)
    // keep the S Pen caption last, and leave a short rest before the pin releases
    tl.to({}, { duration: 0.6 })
  })

  const pen = assets.spen
  return (
    <section id="design" ref={root} className="pin design" aria-labelledby="design-title">
      <div className="design__light" aria-hidden="true">
        <div className="design__glow design__glow--a" />
        <div className="design__glow design__glow--b" />
      </div>

      <h2 id="design-title" className="h2 design__title">Made to be held.</h2>

      <div className="design__body">
        <div className="design__stage">
          {designPanels.map((p) => (
            <SmartImage
              key={p.id}
              className={`design__shot design__shot--${p.id} ${p.id === 'side' ? 'shot--feather' : 'shot--tight'}`}
              src={p.image.src}
              width={p.image.width}
              height={p.image.height}
              alt={`Galaxy S26 Ultra — ${p.id} view`}
            />
          ))}
          <SmartImage className="design__pen shot--feather" src={pen.src} width={pen.width} height={pen.height} alt="Samsung S Pen" />
        </div>

        <div className="design__captions">
          {[...designPanels, { id: 'spen', ...designPenCaption }].map((c) => (
            <div key={c.id} className="design__caption">
              <h3 className="h3">{c.title}</h3>
              <p className="lead">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
