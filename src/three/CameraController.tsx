import { useEffect, useImperativeHandle, useMemo, useRef, type Ref } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { MathUtils, Spherical, Vector3 } from 'three'
import type { OrbitControls as OrbitImpl } from 'three-stdlib'
import { VIEWS, type ViewId } from './views'
export type { ViewId }

export interface CameraApi {
  goTo(view: ViewId): void
  zoom(factor: number): void
  reset(view?: ViewId): void
  focus(world: Vector3): void
  /** Immediate (scroll-driven) framing: look at `target`, distance = fit × zoom, current angles kept. */
  setFrame(target: readonly [number, number, number], zoom: number): void
}
interface Goal { target: Vector3; phi: number; theta: number; radius: number }
interface Props {
  apiRef?: Ref<CameraApi>
  autoRotate?: boolean
  initialView?: ViewId
  enableRotate?: boolean
  reduced?: boolean
  /** Multiplier on the fitted distance (tablet/mobile framing). */
  framing?: number
  /** Called once the camera API is usable (and again after the framing is recomputed). */
  onReady?: () => void
}
const wrap = (a: number) => MathUtils.euclideanModulo(a + Math.PI, Math.PI * 2) - Math.PI

/** OrbitControls (mouse + touch drag) plus eased preset, zoom, reset and focus transitions. */
export default function CameraController({ apiRef, autoRotate = false, initialView = 'front', enableRotate = true, reduced = false, framing = 1, onReady }: Props) {
  const controls = useRef<OrbitImpl>(null)
  const { camera, size } = useThree()
  const goal = useRef<Goal | null>(null)
  const zoomF = useRef(1)
  const viewOf = (id: ViewId) => VIEWS.find((v) => v.id === id)!

  // Distance that frames the 16.3 cm tall phone for the current aspect ratio.
  const fit = useMemo(() => {
    const fov = 32 * (Math.PI / 180), aspect = size.width / Math.max(1, size.height)
    const byH = (16.3 * 1.3) / (2 * Math.tan(fov / 2))
    const byW = (7.8 * 1.5) / (2 * Math.tan(fov / 2) * aspect)
    return Math.max(byH, byW) * framing
  }, [size.width, size.height, framing])

  const place = (id: ViewId, snap: boolean) => {
    const v = viewOf(id)
    const g: Goal = { target: new Vector3(), phi: v.phi, theta: v.theta, radius: fit * zoomF.current }
    if (snap || reduced) { camera.position.setFromSpherical(new Spherical(g.radius, g.phi, g.theta)); controls.current?.target.set(0, 0, 0); controls.current?.update(); goal.current = null }
    else goal.current = g
  }
  useEffect(() => { place(initialView, true) /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [fit])

  useImperativeHandle(apiRef, () => ({
    goTo: (id) => place(id, false),
    reset: (id = 'front') => { zoomF.current = 1; place(id, false) },
    zoom: (f) => {
      zoomF.current = MathUtils.clamp(zoomF.current * f, 0.4, 1.7)
      const c = controls.current; if (!c) return
      const s = new Spherical().setFromVector3(camera.position.clone().sub(c.target))
      goal.current = { target: c.target.clone(), phi: s.phi, theta: s.theta, radius: fit * zoomF.current }
    },
    setFrame: (target, zoom) => {
      const c = controls.current; if (!c) return
      goal.current = null
      const s = new Spherical().setFromVector3(camera.position.clone().sub(c.target))
      zoomF.current = zoom; c.target.set(target[0], target[1], target[2])
      camera.position.setFromSpherical(s.set(fit * zoom, s.phi, s.theta)).add(c.target)
      c.update()
    },
    focus: (world) => {
      const c = controls.current; if (!c) return
      const s = new Spherical().setFromVector3(camera.position.clone().sub(c.target))
      zoomF.current = 0.5
      goal.current = { target: world.clone(), phi: s.phi, theta: s.theta, radius: fit * 0.5 }
    },
  }), [fit, camera, reduced]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { onReady?.() /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [fit])

  const cur = useMemo(() => new Spherical(), [])
  const tmp = useMemo(() => new Vector3(), [])
  useFrame((_, dt) => {
    const c = controls.current, g = goal.current
    if (!c || !g) return
    const k = 1 - Math.exp(-Math.min(dt, 0.05) * 5.5)
    cur.setFromVector3(tmp.copy(camera.position).sub(c.target))
    c.target.lerp(g.target, k)
    cur.theta += wrap(g.theta - cur.theta) * k
    cur.phi += (g.phi - cur.phi) * k
    cur.radius += (g.radius - cur.radius) * k
    camera.position.setFromSpherical(cur).add(c.target)
    c.update()
    if (Math.abs(wrap(g.theta - cur.theta)) + Math.abs(g.phi - cur.phi) + Math.abs(g.radius - cur.radius) + c.target.distanceTo(g.target) < 0.02) goal.current = null
  })

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableZoom={false}
      enableRotate={enableRotate}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.85}
      autoRotate={autoRotate && !reduced}
      autoRotateSpeed={1.4}
      minPolarAngle={0.01}
      maxPolarAngle={Math.PI - 0.01}
      onStart={() => { goal.current = null }}
    />
  )
}
