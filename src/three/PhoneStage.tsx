import { lazy, Suspense, type ComponentProps } from 'react'

// three.js, R3F and drei are split into their own chunk and fetched only when a 3D stage is needed.
const Impl = lazy(() => import('./PhoneStageImpl'))
export default function PhoneStage(props: ComponentProps<typeof Impl>) {
  return (
    <Suspense fallback={<div className="stage"><span className="stage__loading" role="status">Loading 3D model…</span></div>}>
      <Impl {...props} />
    </Suspense>
  )
}
