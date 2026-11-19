import { useMemo, useRef, useState } from 'react'
import PhoneStage from '../three/PhoneStage'
import { ExplodeSlider, ExplodeToggle } from '../three/ViewerControls'
import { useExplodeController } from '../three/useExplode'
import type { CameraApi } from '../three/CameraController'
import { REASSEMBLY, STORY, scrollToExplosion, storyIndex } from '../three/phoneSpec'
import { ScrollTrigger } from '../lib/gsap'
import { useScrollScene } from '../hooks/useScrollScene'
import { BRAND } from '../data/brand'

/**
 * Section 05 — pinned scroll storytelling on the real 3D model.
 * ScrollTrigger only reports progress; the ExplodeController owns explosionProgress and PhoneModel owns the transforms.
 */
export default function Exploded() {
  const root = useRef<HTMLElement>(null)
  const cam = useRef<CameraApi>(null)
  const controller = useExplodeController()
  const [step, setStep] = useState(0)
  const stepRef = useRef(0)
  const current = step >= STORY.length ? REASSEMBLY : STORY[step]
  const labelIds = useMemo(() => (step >= STORY.length ? [] : STORY.slice(Math.max(0, step - 1), step + 1).flatMap((s) => s.ids)), [step])

  useScrollScene(root, ({ isDesktop }) => {
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: 'top top',
      end: isDesktop ? '+=520%' : '+=380%',
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        controller.setScroll(scrollToExplosion(self.progress))
        const i = storyIndex(self.progress)
        if (i !== stepRef.current) { stepRef.current = i; setStep(i) }
      },
    })
    return () => { st.kill(); controller.setScroll(0) }
  })

  return (
    <section id="inside" ref={root} className="pin xp" aria-labelledby="inside-title">
      <div className="xp__text">
        <p className="eyebrow">05 · Engineering exploded view</p>
        <h2 id="inside-title" className="h2 h2--sm">Open it up.</h2>
        <div className="xp__step" aria-live="polite">
          <p className="xp__count">{String(Math.min(step + 1, STORY.length + 1)).padStart(2, '0')} / {STORY.length + 1}</p>
          <h3 className="h3">{current.title}</h3>
          <p className="lead">{current.body}</p>
        </div>
        <ol className="xp__dots" aria-hidden="true">{[...STORY, REASSEMBLY].map((s, i) => <li key={s.key} className={i <= step ? 'is-on' : ''} />)}</ol>
        <div className="xp__toggle"><ExplodeToggle controller={controller} cameraRef={cam} /><ExplodeSlider controller={controller} /></div>
        <p className="xp__hint">Drag the model to rotate it at any point. The {BRAND.product} model is illustrative.</p>
      </div>
      <div className="xp__stage">
        <PhoneStage cameraRef={cam} controller={controller} initialView="front" hotspots={labelIds} hotspotLabels={step < STORY.length - 1} poseYaw={-0.75} posePitch={0.22} />
      </div>
    </section>
  )
}
