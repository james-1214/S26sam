import { useEffect, useRef, useState } from 'react'
import PhoneStage from '../three/PhoneStage'
import ViewerControls from '../three/ViewerControls'
import ComponentInspector from '../three/ComponentInspector'
import { useExplodeController } from '../three/useExplode'
import type { CameraApi } from '../three/CameraController'
import type { PhoneModelApi } from '../three/PhoneModel'
import { BRAND } from '../data/brand'

/** Section 07 — inspect any part: highlight, isolate, focus, rotate, zoom, reset. */
export default function Inspect() {
  const controller = useExplodeController()
  const cam = useRef<CameraApi>(null)
  const model = useRef<PhoneModelApi>(null)
  const [sel, setSel] = useState<string | null>(null)
  const [isolate, setIsolate] = useState(false)

  useEffect(() => { controller.setManual(1) }, [controller])

  const select = (id: string | null) => {
    setSel(id)
    if (!id) { setIsolate(false); cam.current?.reset('iso'); return }
    const c = model.current?.centerOf(id)
    if (c) cam.current?.focus(c)
  }
  const reset = () => { setSel(null); setIsolate(false); cam.current?.reset('iso') }

  return (
    <section id="inspect" className="inspect" aria-labelledby="inspect-title">
      <header className="viewer__head" data-reveal>
        <p className="eyebrow">07 · Component inspection</p>
        <h2 id="inspect-title" className="h2">Look closer.</h2>
        <p className="lead">Pick any layer of the {BRAND.product}. The camera flies to it; isolate it to see it on its own, then keep rotating.</p>
      </header>
      <div className="inspect__grid">
        <div className="viewer__stage">
          <PhoneStage cameraRef={cam} modelRef={model} controller={controller} initialView="iso" selectedId={sel} isolate={isolate} onSelect={select} hotspots="all" hotspotLabels={false} poseYaw={-0.35} />
          <ViewerControls className="viewer__controls" cameraRef={cam} controller={controller} presets={false} onReset={reset} />
        </div>
        <ComponentInspector selectedId={sel} onSelect={select} isolate={isolate} onIsolate={setIsolate} onReset={reset} />
      </div>
    </section>
  )
}
