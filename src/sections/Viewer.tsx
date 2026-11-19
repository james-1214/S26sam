import { useRef, useState } from 'react'
import PhoneStage from '../three/PhoneStage'
import ViewerControls from '../three/ViewerControls'
import ComponentInspector from '../three/ComponentInspector'
import { useExplodeController } from '../three/useExplode'
import type { CameraApi } from '../three/CameraController'
import type { PhoneModelApi } from '../three/PhoneModel'
import { prefersReduced } from '../lib/device'
import { BRAND } from '../data/brand'

/** Section 04 — a genuine 360° viewer on the real 3D model. */
export default function Viewer() {
  const controller = useExplodeController()
  const cam = useRef<CameraApi>(null)
  const model = useRef<PhoneModelApi>(null)
  const [auto, setAuto] = useState(() => !prefersReduced())
  const [sel, setSel] = useState<string | null>(null)
  const [isolate, setIsolate] = useState(false)

  const select = (id: string | null) => {
    setSel(id)
    if (!id) { setIsolate(false); return }
    const c = model.current?.centerOf(id)
    if (c) { setAuto(false); cam.current?.focus(c) }
  }
  const reset = () => { setSel(null); setIsolate(false); cam.current?.reset(controller.target > 0.5 ? 'iso' : 'front') }

  return (
    <section id="viewer" className="viewer" aria-labelledby="viewer-title">
      <header className="viewer__head" data-reveal>
        <p className="eyebrow">04 · 360° viewer</p>
        <h2 id="viewer-title" className="h2">Turn it. Truly.</h2>
        <p className="lead">The {BRAND.product} is a live 3D model. Drag or swipe to spin it, jump to any side, zoom in, and pull it apart without losing your angle.</p>
      </header>
      <div className="viewer__stage">
        <PhoneStage cameraRef={cam} modelRef={model} controller={controller} autoRotate={auto} initialView="iso" selectedId={sel} isolate={isolate} onSelect={select} hotspots="none" />
        <ViewerControls className="viewer__controls" cameraRef={cam} controller={controller} autoRotate={auto} onAutoRotate={setAuto} onReset={reset} />
        {sel && <div className="viewer__insp"><ComponentInspector compact selectedId={sel} onSelect={select} isolate={isolate} onIsolate={setIsolate} onReset={reset} /></div>}
      </div>
    </section>
  )
}
