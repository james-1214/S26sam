import { useRef, useState } from 'react'
import PhoneStage from '../three/PhoneStage'
import { useExplodeController } from '../three/useExplode'
import type { CameraApi, ViewId } from '../three/CameraController'
import { COMPONENT_IDS } from '../three/phoneSpec'

interface Preset { id: string; label: string; body: string; p: number; view: ViewId }
const PRESETS: readonly Preset[] = [
  { id: 'overview', label: 'Overview', body: 'The finished phone, every layer in place.', p: 0, view: 'iso' },
  { id: 'front', label: 'Front stack', body: 'Cover glass, display and shield, peeled back one at a time.', p: 0.3, view: 'iso' },
  { id: 'inside', label: 'Inside', body: 'Board, processor, cooling and battery laid out around the frame.', p: 0.82, view: 'iso' },
  { id: 'back', label: 'Back stack', body: 'The rear glass and the camera hardware behind it.', p: 0.5, view: 'back' },
]

/** Section 06 — drag the layer slider through the real 3D model, or jump to a curated view. */
export default function AnatomyExplorer() {
  const controller = useExplodeController()
  const cam = useRef<CameraApi>(null)
  const [active, setActive] = useState(PRESETS[0])
  const [value, setValue] = useState(0)

  const apply = (p: Preset) => { setActive(p); setValue(p.p); controller.setManual(p.p); cam.current?.goTo(p.view) }

  return (
    <div className="anat">
      <div className="anat__tabs" role="tablist" aria-label="Anatomy views">
        {PRESETS.map((p) => (
          <button key={p.id} type="button" role="tab" className="chip" aria-selected={active.id === p.id} onClick={() => apply(p)}>{p.label}</button>
        ))}
      </div>
      <div className="viewer__stage anat__stage">
        <PhoneStage cameraRef={cam} controller={controller} initialView="iso" hotspots={value > 0.05 ? COMPONENT_IDS : 'none'} hotspotLabels={false} poseYaw={-0.3} />
      </div>
      <label className="anat__slider">
        <span>Layers</span>
        <input type="range" min={0} max={1} step={0.01} value={value} aria-label="Separate the layers" onChange={(e) => { const v = Number(e.target.value); setValue(v); controller.setManual(v) }} />
        <span>{Math.round(value * 100)}%</span>
      </label>
      <p className="lead anat__caption" aria-live="polite">{active.body}</p>
    </div>
  )
}
