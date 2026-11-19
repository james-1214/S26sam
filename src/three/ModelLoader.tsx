import { Suspense, type ReactNode } from 'react'
import { Html } from '@react-three/drei'

/**
 * Suspense boundary for the 3D scene with a visible loading state.
 * The phone is currently procedural (built synchronously), so this never waits on the network;
 * it is the single place a useGLTF('/models/phone.glb') call would suspend if a Blender export is added later.
 */
export default function ModelLoader({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<Html center><span className="stage__loading" role="status">Loading 3D model…</span></Html>}>
      {children}
    </Suspense>
  )
}
