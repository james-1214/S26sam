import { BufferGeometry, ExtrudeGeometry, Path, Shape, ShapeGeometry, BoxGeometry, Matrix4 } from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

function rr(p: Path, w: number, h: number, r: number, cx = 0, cy = 0, ccw = true): void {
  const x = cx - w / 2, y = cy - h / 2
  if (ccw) {
    p.moveTo(x + r, y).lineTo(x + w - r, y).absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false)
      .lineTo(x + w, y + h - r).absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false)
      .lineTo(x + r, y + h).absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false)
      .lineTo(x, y + r).absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false)
  } else {
    p.moveTo(x + r, y).absarc(x + r, y + r, r, Math.PI * 1.5, Math.PI, true)
      .lineTo(x, y + h - r).absarc(x + r, y + h - r, r, Math.PI, Math.PI / 2, true)
      .lineTo(x + w - r, y + h).absarc(x + w - r, y + h - r, r, Math.PI / 2, 0, true)
      .lineTo(x + w, y + r).absarc(x + w - r, y + r, r, 0, -Math.PI / 2, true)
  }
}
export const roundedShape = (w: number, h: number, r: number): Shape => { const s = new Shape(); rr(s, w, h, r); return s }

/** Rounded slab centred on the origin. Optional rectangular holes (cx, cy, w, h). */
export function slab(w: number, h: number, d: number, r: number, holes: ReadonlyArray<readonly [number, number, number, number]> = [], bevel = 0): BufferGeometry {
  const s = roundedShape(w, h, r)
  holes.forEach(([cx, cy, hw, hh]) => { const p = new Path(); rr(p, hw, hh, Math.min(0.3, hw / 4, hh / 4), cx, cy, false); s.holes.push(p) })
  const g = new ExtrudeGeometry(s, { depth: d - bevel * 2, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2, curveSegments: 10 })
  g.translate(0, 0, -d / 2 + bevel)
  return g
}

/** Titanium ring with a rounded inner opening. */
export function ring(w: number, h: number, d: number, wall: number, r: number): BufferGeometry {
  const s = roundedShape(w, h, r)
  const hole = new Path(); rr(hole, w - 2 * wall, h - 2 * wall, Math.max(0.2, r - wall), 0, 0, false)
  s.holes.push(hole)
  const b = 0.04
  const g = new ExtrudeGeometry(s, { depth: d - 2 * b, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 2, curveSegments: 14 })
  g.translate(0, 0, -d / 2 + b)
  return g
}

/** Plane with 0–1 UVs, for the screen texture. */
export function screenPlane(w: number, h: number, r: number): BufferGeometry {
  const g = new ShapeGeometry(roundedShape(w, h, r), 12)
  const uv = g.attributes.uv, pos = g.attributes.position
  for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getX(i) / w + 0.5, pos.getY(i) / h + 0.5)
  return g
}

/** Many boxes merged into one geometry (one draw call). boxes: [cx, cy, cz, w, h, d]. */
export function mergedBoxes(boxes: ReadonlyArray<readonly number[]>): BufferGeometry {
  const parts = boxes.map(([cx, cy, cz, w, h, d]) => {
    const g = new BoxGeometry(w, h, d)
    g.applyMatrix4(new Matrix4().makeTranslation(cx, cy, cz))
    return g
  })
  const merged = mergeGeometries(parts)!
  parts.forEach((g) => g.dispose())
  return merged
}
