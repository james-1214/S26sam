import { Pause, Play, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'
import type { RefObject } from 'react'
import type { CameraApi } from './CameraController'
import { VIEWS } from './views'
import type { ExplodeController } from './ExplodeController'
import { useExplodeState, useExplodeTarget } from './useExplode'

interface Props {
  cameraRef: RefObject<CameraApi | null>
  controller?: ExplodeController
  autoRotate?: boolean
  onAutoRotate?: (v: boolean) => void
  presets?: boolean
  onReset?: () => void
  className?: string
}

/** Floating control panel: camera presets, auto-rotate, zoom, reset and ASSEMBLED / EXPLODED. */
export default function ViewerControls({ cameraRef, controller, autoRotate, onAutoRotate, presets = true, onReset, className = '' }: Props) {
  const cam = () => cameraRef.current
  return (
    <div className={`vctl ${className}`} role="toolbar" aria-label="3D viewer controls">
      {controller && <ExplodeToggle controller={controller} cameraRef={cameraRef} />}
      {controller && <ExplodeSlider controller={controller} />}
      {presets && (
        <div className="vctl__row" role="group" aria-label="Camera views">
          {VIEWS.filter((v) => v.id !== 'iso').map((v) => (
            <button key={v.id} type="button" className="vctl__btn" onClick={() => cam()?.goTo(v.id)}>{v.label}</button>
          ))}
        </div>
      )}
      <div className="vctl__row">
        {onAutoRotate && (
          <button type="button" className="vctl__btn vctl__btn--icon" aria-pressed={autoRotate} onClick={() => onAutoRotate(!autoRotate)}>
            {autoRotate ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
            <span>Auto-rotate {autoRotate ? 'on' : 'off'}</span>
          </button>
        )}
        <button type="button" className="vctl__btn vctl__btn--icon" aria-label="Zoom in" onClick={() => cam()?.zoom(0.8)}><ZoomIn size={18} aria-hidden="true" /></button>
        <button type="button" className="vctl__btn vctl__btn--icon" aria-label="Zoom out" onClick={() => cam()?.zoom(1.25)}><ZoomOut size={18} aria-hidden="true" /></button>
        <button type="button" className="vctl__btn vctl__btn--icon" aria-label="Reset camera" onClick={() => { cam()?.reset(controller?.target ? 'iso' : 'front'); onReset?.() }}><RotateCcw size={16} aria-hidden="true" /></button>
      </div>
    </div>
  )
}

export function ExplodeToggle({ controller, cameraRef }: { controller: ExplodeController; cameraRef?: RefObject<CameraApi | null> }) {
  const state = useExplodeState(controller)
  return (
    <div className="vctl__seg" role="group" aria-label="Assembly state">
      <button type="button" className="vctl__segbtn" aria-pressed={state === 'assembled'} onClick={() => { controller.setManual(0); cameraRef?.current?.goTo('front') }}>Assembled</button>
      <button type="button" className="vctl__segbtn" aria-pressed={state === 'exploded'} onClick={() => { controller.setManual(1); cameraRef?.current?.goTo('iso') }}>Exploded</button>
    </div>
  )
}

/** Real-time explosion scrubber: drag and the parts follow immediately (same controller as scroll and the buttons). */
export function ExplodeSlider({ controller }: { controller: ExplodeController }) {
  const target = useExplodeTarget(controller)
  return (
    <label className="xslider">
      <span>Explode</span>
      <input type="range" min={0} max={1} step={0.005} value={target} aria-label="Explosion amount" onChange={(e) => controller.setManual(Number(e.target.value))} />
      <output>{Math.round(target * 100)}%</output>
    </label>
  )
}
