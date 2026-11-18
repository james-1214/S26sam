import { useRef } from 'react'
import SmartImage from '../components/SmartImage'
import { assets } from '../assets'
import { cameraCallouts, cameraIntro } from '../data/content'
import { gsap } from '../lib/gsap'
import { sequence } from '../lib/sequence'
import { useScrollScene } from '../hooks/useScrollScene'

export default function Camera() {
  const root = useRef<HTMLElement>(null)

  useScrollScene(root, ({ isDesktop }) => {
    const all = <T extends Element>(sel: string) => gsap.utils.toArray<T>(sel, root.current!)
    const captions = all('.camera__caption')
    const callouts = all<HTMLElement>('.callout')

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root.current,
        start: 'top top',
        end: isDesktop ? '+=300%' : '+=220%',
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })

    // Close-up on the lens cluster, then pull back to reveal the whole panel
    gsap.set('.camera__zoom', { scale: isDesktop ? 2 : 1.7, transformOrigin: '20% 24%' })
    tl.to('.camera__zoom', { scale: 1, duration: 1, ease: 'power2.inOut' }, 0)
      .fromTo('.camera__glow', { opacity: 0.4, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1 }, 0)

    // Captions in sequence: intro, then main / ultra-wide / telephoto
    sequence(tl, captions, {
      at: 0.4,
      gap: 1,
      hidden: { autoAlpha: 0, y: 24 },
      shown: { autoAlpha: 1, y: 0 },
    })

    // Callouts appear one after another and stay; the previous one dims
    callouts.forEach((el, i) => {
      const t = 1.4 + i
      const dot = el.querySelector('.callout__dot')
      const line = el.querySelector('.callout__line')
      const text = el.querySelector('.callout__text')
      gsap.set(dot, { scale: 0, opacity: 0 })
      gsap.set(line, { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(text, { opacity: 0, x: -10 })
      tl.to(dot, { scale: 1, opacity: 1, duration: 0.25, ease: 'back.out(2)' }, t)
        .to(line, { scaleX: 1, duration: 0.4, ease: 'power2.out' }, t + 0.1)
        .to(text, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }, t + 0.3)
      if (i < callouts.length - 1) tl.to(el, { opacity: 0.4, duration: 0.3 }, t + 1)
    })
    tl.to({}, { duration: 0.6 })
  })

  const back = assets.back
  return (
    <section id="camera" ref={root} className="pin camera" aria-labelledby="camera-title">
      <div className="camera__glow" aria-hidden="true" />
      <h2 id="camera-title" className="h2 camera__title">See further.</h2>

      <div className="camera__body">
        <div className="camera__phone">
          <div className="camera__zoom">
            <SmartImage className="camera__img shot--tight" src={back.src} width={back.width} height={back.height} alt="Galaxy S26 Ultra rear camera module" />
          </div>
          <div className="camera__callouts" aria-hidden="true">
            {cameraCallouts.map((c) => (
              <div key={c.id} className="callout" style={{ top: `${c.y}%` }}>
                <span className="callout__dot" />
                <span className="callout__line" />
                <span className="callout__text">{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="camera__captions">
          <div className="camera__caption">
            <h3 className="h3">{cameraIntro.title}</h3>
            <p className="lead">{cameraIntro.body}</p>
          </div>
          {cameraCallouts.map((c) => (
            <div key={c.id} className="camera__caption">
              <h3 className="h3">{c.label}</h3>
              <p className="lead">{c.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
