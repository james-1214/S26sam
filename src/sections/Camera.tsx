import { useRef } from 'react'
import PhoneStage from '../three/PhoneStage'
import { useExplodeController } from '../three/useExplode'
import type { CameraApi } from '../three/CameraController'
import { cameraCallouts, cameraIntro } from '../data/content'
import { gsap } from '../lib/gsap'
import { sequence } from '../lib/sequence'
import { useScrollScene } from '../hooks/useScrollScene'

export default function Camera() {
  const root = useRef<HTMLElement>(null)
  const controller = useExplodeController()
  const cam = useRef<CameraApi>(null)
  const k = useRef({ v: 0 })
  const frame = () => {
    const v = k.current.v
    cam.current?.setFrame([2 * (1 - v), 5.6 * (1 - v), -0.5 * (1 - v)], 0.42 + 0.58 * v)
  }

  useScrollScene(root, ({ isDesktop }) => {
    const all = <T extends Element>(sel: string) => gsap.utils.toArray<T>(sel, root.current!)
    const captions = all('.camera__caption')

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
    k.current.v = 0
    tl.to(k.current, { v: 1, duration: 1, ease: 'power2.inOut', onUpdate: frame }, 0)
      .fromTo('.camera__glow', { opacity: 0.4, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1 }, 0)

    // Captions in sequence: intro, then main / ultra-wide / telephoto
    sequence(tl, captions, {
      at: 0.4,
      gap: 1,
      hidden: { autoAlpha: 0, y: 24 },
      shown: { autoAlpha: 1, y: 0 },
    })

    tl.to({}, { duration: 0.6 })
  })

  return (
    <section id="camera" ref={root} className="pin camera" aria-labelledby="camera-title">
      <div className="camera__glow" aria-hidden="true" />
      <h2 id="camera-title" className="h2 camera__title">See further.</h2>

      <div className="camera__body">
        <div className="camera__phone">
          <div className="camera__zoom">
            <PhoneStage controller={controller} cameraRef={cam} initialView="back" hotspots={['CameraLenses']} hotspotLabels={false} onReady={frame} />
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
