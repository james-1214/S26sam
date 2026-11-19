import { useRef, useState } from 'react'
import PhoneStage from '../three/PhoneStage'
import type { CameraApi } from '../three/CameraController'
import type { PhoneModelApi, PhoneScript } from '../three/PhoneModel'
import { useExplodeController } from '../three/useExplode'
import { designPanels, designPenCaption } from '../data/content'
import { gsap } from '../lib/gsap'
import { sequence } from '../lib/sequence'
import { useScrollScene } from '../hooks/useScrollScene'
import { BRAND } from '../data/brand'

/** Design: one real 3D phone turned through the beats by GSAP (script channel); the stylus beat isolates that part. */
export default function Design() {
  const root = useRef<HTMLElement>(null)
  const controller = useExplodeController()
  const script = useRef<PhoneScript>({ yaw: 0, pitch: 0 })
  const cam = useRef<CameraApi>(null)
  const model = useRef<PhoneModelApi>(null)
  const [penBeat, setPenBeat] = useState(false)
  const penRef = useRef(false)

  useScrollScene(root, ({ isDesktop }) => {
    const all = <T extends Element>(sel: string) => gsap.utils.toArray<T>(sel, root.current!)
    const captions = all('.design__caption')
    const s = script.current

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
        onUpdate: (self) => {
          const on = self.progress > 0.78
          if (on === penRef.current) return
          penRef.current = on; setPenBeat(on)
          if (on) { const c = model.current?.centerOf('SPen'); if (c) cam.current?.focus(c) } else cam.current?.reset('front')
        },
      },
    })

    gsap.set('.design__glow--b', { opacity: 0 })
    sequence(tl, captions, { gap: 1, hidden: { autoAlpha: 0, y: 24 }, shown: { autoAlpha: 1, y: 0 } })
    // beats: front -> back -> side profile -> stylus
    tl.to(s, { yaw: Math.PI, duration: 1 }, 0.55)
      .to(s, { yaw: Math.PI * 1.5, pitch: 0.06, duration: 1 }, 1.55)
      .to(s, { yaw: Math.PI * 2 - 0.5, pitch: 0.18, duration: 1 }, 2.55)
      .to('.design__glow--a', { opacity: 0, duration: 1 }, 0.6)
      .to('.design__glow--b', { opacity: 1, duration: 1 }, 0.6)
      .to('.design__glow--b', { opacity: 0.55, duration: 1 }, 2.2)
    tl.to({}, { duration: 0.8 })
    return () => { s.yaw = 0; s.pitch = 0; penRef.current = false }
  })

  return (
    <section id="design" ref={root} className="pin design" aria-labelledby="design-title">
      <div className="design__light" aria-hidden="true">
        <div className="design__glow design__glow--a" />
        <div className="design__glow design__glow--b" />
      </div>

      <h2 id="design-title" className="h2 design__title">Made to be held.</h2>

      <div className="design__body">
        <div className="design__stage design__stage--3d">
          <PhoneStage controller={controller} script={script} cameraRef={cam} modelRef={model} interactive={false} initialView="front" selectedId={penBeat ? 'SPen' : null} isolate={penBeat} framing={0.9} />
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
      <p className="sr-only">Interactive 3D model of the {BRAND.product}, turning to show the front, back, side and stylus.</p>
    </section>
  )
}
