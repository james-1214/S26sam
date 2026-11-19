import type { Ref } from 'react'
import SmartImage from '../components/SmartImage'
import { assets } from '../assets'
import { BRAND } from '../data/brand'
import { prefersReduced, tierOf } from '../lib/device'
import PhoneCanvas from './PhoneCanvas'
import PhoneModel, { type PhoneModelApi, type PhoneModelProps } from './PhoneModel'
import CameraController, { type CameraApi, type ViewId } from './CameraController'

interface Props extends Omit<PhoneModelProps, 'apiRef'> {
  cameraRef?: Ref<CameraApi>
  modelRef?: Ref<PhoneModelApi>
  autoRotate?: boolean
  initialView?: ViewId
  className?: string
  interactive?: boolean
  onReady?: () => void
  /** Overrides the distance multiplier (<1 = closer). */
  framing?: number
}

/** Canvas + model + camera, wired together. */
export default function PhoneStage({ cameraRef, modelRef, autoRotate = false, initialView = 'front', className, interactive = true, onReady, framing, ...model }: Props) {
  const tier = tierOf(window.innerWidth)
  const reduced = prefersReduced()
  model.controller.reduced = reduced
  return (
    <PhoneCanvas
      className={className}
      label={`Interactive 3D model of the ${BRAND.product}. Drag to rotate.`}
      fallback={<SmartImage className="shot--tight" src={assets.hero.src} width={assets.hero.width} height={assets.hero.height} alt={`${BRAND.product}, front view`} />}
    >
      <CameraController apiRef={cameraRef} autoRotate={autoRotate} initialView={initialView} enableRotate={interactive} reduced={reduced} framing={framing ?? (tier === 'tablet' ? 1.05 : 1)} onReady={onReady} />
      <PhoneModel {...model} apiRef={modelRef} hotspotLabels={tier !== 'mobile' && model.hotspotLabels !== false} />
    </PhoneCanvas>
  )
}
