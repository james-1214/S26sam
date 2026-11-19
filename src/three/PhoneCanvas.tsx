import { Component, useEffect, useRef, useState, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { tierOf, webglAvailable } from '../lib/device'
import ModelLoader from './ModelLoader'

/** Reusable R3F canvas: lazy mount near the viewport, paused off-screen, studio lighting, graceful failure. */
export interface PhoneCanvasProps { children: ReactNode; className?: string; fallback: ReactNode; label: string; fov?: number }

class Boundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(e: unknown) { console.warn('[3D] render failed, showing fallback', e) }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

function useNear(ref: React.RefObject<Element | null>, margin: string): boolean {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, margin])
  return on
}

export default function PhoneCanvas({ children, className = '', fallback, label, fov = 32 }: PhoneCanvasProps) {
  const host = useRef<HTMLDivElement>(null)
  const near = useNear(host, '120% 0px')
  const visible = useNear(host, '0px')
  const [ok] = useState(() => webglAvailable())
  const [lost, setLost] = useState(false)
  const tier = tierOf(typeof window === 'undefined' ? 1200 : window.innerWidth)

  return (
    <div ref={host} className={`stage ${className}`} role="img" aria-label={label}>
      {!ok || lost ? (
        <div className="stage__fallback">{fallback}<p>3D preview unavailable on this device.</p></div>
      ) : (
        near && (
          <Boundary fallback={<div className="stage__fallback">{fallback}<p>3D preview could not be loaded.</p></div>}>
            <Canvas
              frameloop={visible ? 'always' : 'never'}
              dpr={tier === 'mobile' ? [1, 1.5] : [1, 2]}
              camera={{ fov, near: 0.1, far: 300, position: [0, 0, 40] }}
              gl={{ antialias: tier !== 'mobile', powerPreference: 'high-performance' }}
              onCreated={({ gl }) => gl.domElement.addEventListener('webglcontextlost', (e) => { e.preventDefault(); setLost(true) })}
            >
              <ModelLoader>
                <ambientLight intensity={0.45} />
                <directionalLight position={[6, 10, 12]} intensity={2.2} color="#efe6ff" />
                <directionalLight position={[-10, -4, -8]} intensity={1.1} color="#7a3cff" />
                <Environment resolution={128} frames={1}>
                  <Lightformer form="rect" intensity={3} color="#c9b6ff" position={[0, 8, 6]} scale={[14, 4, 1]} />
                  <Lightformer form="rect" intensity={2.4} color="#7a3cff" position={[-9, 0, 2]} rotation-y={Math.PI / 2} scale={[12, 6, 1]} />
                  <Lightformer form="rect" intensity={1.6} color="#ffffff" position={[9, 2, -4]} rotation-y={-Math.PI / 2} scale={[10, 5, 1]} />
                  <Lightformer form="ring" intensity={1.2} color="#9b6bff" position={[0, -6, -8]} scale={10} />
                </Environment>
                {children}
              </ModelLoader>
            </Canvas>
          </Boundary>
        )
      )}
    </div>
  )
}
