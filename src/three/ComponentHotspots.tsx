import { Fragment } from 'react'
import { createPortal } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { Part } from './buildPhone'

interface Props {
  parts: Map<string, Part>
  ids?: readonly string[]
  selectedId: string | null
  onSelect?: (id: string | null) => void
  labels: boolean
}

/** Numbered dots (and optional labels) attached to each component, so they travel with it. */
export default function ComponentHotspots({ parts, ids, selectedId, onSelect, labels }: Props) {
  const list = [...parts.values()].filter((p) => !ids || ids.includes(p.spec.id))
  return (
    <>
      {list.map((part) =>
        <Fragment key={part.spec.id}>{createPortal(
          <group position={[...part.spec.anchor]}>
            <Html center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
              <button
                type="button"
                className={`hotspot ${selectedId === part.spec.id ? 'is-active' : ''}`}
                style={{ pointerEvents: onSelect ? 'auto' : 'none' }}
                aria-label={`Inspect ${part.spec.label}`}
                onClick={() => onSelect?.(selectedId === part.spec.id ? null : part.spec.id)}
              >
                <i aria-hidden="true" />
                {labels && <span>{part.spec.label}</span>}
              </button>
            </Html>
          </group>,
          part.group,
        )}</Fragment>,
      )}
    </>
  )
}
