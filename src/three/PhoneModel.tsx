import { useEffect, useMemo, useRef, type MutableRefObject, type Ref, useImperativeHandle } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { Color, MathUtils, Vector3, type Object3D, type MeshStandardMaterial } from 'three'
import { buildPhone } from './buildPhone'
import { explodedScale, poseOf } from './phoneSpec'
import type { ExplodeController } from './ExplodeController'
import ComponentHotspots from './ComponentHotspots'

/** Camera-side script channel for GSAP (scroll beats). Added to the model's turntable rotation; never touches a component. */
export interface PhoneScript { yaw: number; pitch: number }
export interface PhoneModelApi { centerOf(id: string): Vector3 | null }
export interface PhoneModelProps {
  controller: ExplodeController
  selectedId?: string | null
  isolate?: boolean
  onSelect?: (id: string | null) => void
  hotspots?: 'none' | 'all' | readonly string[]
  hotspotLabels?: boolean
  /** Extra yaw/pitch (radians) blended in with explosion progress, so the stack fans out toward the camera. */
  poseYaw?: number
  posePitch?: number
  script?: MutableRefObject<PhoneScript>
  apiRef?: Ref<PhoneModelApi>
}

const GLOW = new Color('#9b6bff')
const idOf = (o: Object3D | null): string | null => { while (o) { if (o.userData.componentId) return o.userData.componentId as string; o = o.parent } return null }

/** Renders the procedural phone. The only place component transforms are written. */
export default function PhoneModel({ controller, selectedId = null, isolate = false, onSelect, hotspots = 'none', hotspotLabels = true, poseYaw = 0, posePitch = 0, script, apiRef }: PhoneModelProps) {
  const phone = useMemo(() => buildPhone(), [])
  useEffect(() => () => phone.dispose(), [phone])
  const sel = useRef({ selectedId, isolate }); sel.current = { selectedId, isolate }
  const fades = useRef(new Map<string, number>())
  const dirty = useRef(true)
  useEffect(() => { dirty.current = true }, [selectedId, isolate])

  useImperativeHandle(apiRef, () => ({
    centerOf: (id) => { const p = phone.parts.get(id); return p ? p.group.getWorldPosition(new Vector3()) : null },
  }), [phone])

  useFrame((_, dt) => {
    const moved = controller.step(Math.min(dt, 0.05))
    const p = controller.progress
    if (moved || dirty.current) {
      phone.parts.forEach((part) => {
        const t = poseOf(part.spec, p)
        part.group.position.set(...t.position)
        part.group.rotation.set(...t.rotation)
      })
      const s = explodedScale(p)
      phone.root.scale.setScalar(s)
    }
    phone.root.rotation.set(posePitch * p + (script?.current.pitch ?? 0), poseYaw * p + (script?.current.yaw ?? 0), 0)
    // highlight / isolation, eased
    const { selectedId: id, isolate: iso } = sel.current
    let animating = false
    phone.parts.forEach((part, key) => {
      const goal = iso && id && key !== id ? 0 : 1
      const cur = fades.current.get(key) ?? 1
      const next = Math.abs(goal - cur) < 0.01 ? goal : cur + (goal - cur) * Math.min(1, dt * 9)
      if (next !== cur) animating = true
      fades.current.set(key, next)
      part.group.visible = next > 0.01
      const glow = key === id ? 0.22 : 0
      part.materials.forEach((m, i) => {
        const mat = m as MeshStandardMaterial
        const want = part.base[i] < 0.999 || next < 0.999
        if (mat.transparent !== want) { mat.transparent = want; mat.depthWrite = !want || part.base[i] >= 0.999 ? next >= 0.999 : false; mat.needsUpdate = true }
        mat.opacity = part.base[i] * next
        if (mat.emissive && key !== 'DisplayAssembly') {
          if (!mat.userData.emi0) mat.userData.emi0 = { c: mat.emissive.clone(), i: mat.emissiveIntensity }
          mat.emissive.copy(glow ? GLOW : mat.userData.emi0.c)
          mat.emissiveIntensity = glow ? MathUtils.lerp(mat.emissiveIntensity, glow, 0.2) : mat.userData.emi0.i
        }
      })
    })
    dirty.current = animating
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (!onSelect || e.delta > 5) return
    e.stopPropagation()
    onSelect(idOf(e.object))
  }

  return (
    <>
      <primitive
        object={phone.root}
        onClick={handleClick}
        onPointerMissed={() => undefined}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => { if (onSelect) { e.stopPropagation(); document.body.style.cursor = 'pointer' } }}
        onPointerOut={() => { document.body.style.cursor = '' }}
      />
      {hotspots !== 'none' && <ComponentHotspots parts={phone.parts} ids={hotspots === 'all' ? undefined : hotspots} selectedId={selectedId} onSelect={onSelect} labels={hotspotLabels} />}
    </>
  )
}
