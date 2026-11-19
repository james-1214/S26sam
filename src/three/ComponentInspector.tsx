import { X } from 'lucide-react'
import { COMPONENTS, byId } from './phoneSpec'

interface Props {
  selectedId: string | null
  onSelect: (id: string | null) => void
  isolate: boolean
  onIsolate: (v: boolean) => void
  onReset: () => void
  compact?: boolean
}

/** Component list + details for the selected part. Specification values are placeholders until final data is supplied. */
export default function ComponentInspector({ selectedId, onSelect, isolate, onIsolate, onReset, compact = false }: Props) {
  const c = selectedId ? byId(selectedId) : undefined
  return (
    <aside className={`insp ${compact ? 'insp--compact' : ''}`} aria-label="Component inspector">
      {!compact && (
        <ul className="insp__list" aria-label="Components">
          {COMPONENTS.map((k) => (
            <li key={k.id}>
              <button type="button" className="chip" aria-pressed={selectedId === k.id} onClick={() => onSelect(selectedId === k.id ? null : k.id)}>{k.label}</button>
            </li>
          ))}
        </ul>
      )}
      <div className="insp__card" aria-live="polite">
        {c ? (
          <>
            <div className="insp__head">
              <p className="insp__layer">Layer {String(c.inspection.layer).padStart(2, '0')} · {c.id}</p>
              {compact && <button type="button" className="insp__close" aria-label="Close inspector" onClick={() => onSelect(null)}><X size={16} aria-hidden="true" /></button>}
            </div>
            <h3 className="h3">{c.label}</h3>
            <p className="lead">{c.inspection.description}</p>
            <dl className="insp__meta">
              <div><dt>Role</dt><dd>{c.inspection.role}</dd></div>
              <div><dt>Material</dt><dd>{c.inspection.materialNote}</dd></div>
              <div><dt>Specification</dt><dd>{c.inspection.spec}</dd></div>
            </dl>
            <div className="insp__actions">
              <button type="button" className="vctl__btn" aria-pressed={isolate} onClick={() => onIsolate(!isolate)}>{isolate ? 'Show all parts' : 'Isolate part'}</button>
              <button type="button" className="vctl__btn" onClick={onReset}>Reset inspection</button>
            </div>
          </>
        ) : (
          <p className="lead">{compact ? 'Tap a part to inspect it.' : 'Select a part — in the list or on the model — to focus the camera, read its role and isolate it.'}</p>
        )}
      </div>
    </aside>
  )
}
