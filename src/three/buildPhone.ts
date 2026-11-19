import { CylinderGeometry, Group, Mesh, type Material, type Object3D, BoxGeometry, ConeGeometry, type BufferGeometry, type CanvasTexture } from 'three'
import { COMPONENTS, INNER, PHONE, poseOf, type ComponentSpec } from './phoneSpec'
import { mergedBoxes, ring, screenPlane, slab } from './geometry'
import { makeMaterial, screenTexture } from './materials'
import { BRAND } from '../data/brand'

export interface Part { spec: ComponentSpec; group: Group; materials: Material[]; base: number[] }
export interface Phone { root: Group; parts: Map<string, Part>; dispose: () => void }

const lensRing = new CylinderGeometry(0.6, 0.6, 0.1, 28).rotateX(Math.PI / 2)
const lensGlass = new CylinderGeometry(0.44, 0.44, 0.14, 28).rotateX(Math.PI / 2)

function geometryFor(id: string): BufferGeometry[] {
  const w = INNER.width, h = INNER.height
  switch (id) {
    case 'Frame': return [ring(PHONE.width, PHONE.height, PHONE.depth, PHONE.wall, 1.1)]
    case 'FrontGlass': return [slab(w, h, 0.06, 0.8)]
    case 'RearGlass': return [slab(w, h, 0.06, 0.8)]
    case 'DisplayAssembly': return [slab(7, 15.4, 0.06, 0.7)]
    case 'InternalShield': return [slab(7, 15.4, 0.04, 0.7, [[0, 3.9, 5.2, 6.5], [0, -3.7, 5.2, 7.7]])]
    case 'Battery': return [slab(5.8, 8.2, 0.4, 0.4, [], 0.04)]
    case 'CameraSystem': return [slab(3, 4.2, 0.16, 0.3)]
    case 'CoolingChamber': return [slab(4.2, 6, 0.06, 0.4)]
    case 'FlexCables': return [new BoxGeometry(4, 0.5, 0.03)]
    case 'SPen': return [new CylinderGeometry(0.25, 0.25, 6, 20).translate(0, 0.3, 0)]
    default: return []
  }
}

export function buildPhone(): Phone {
  const root = new Group(); root.name = 'PhoneRoot'
  const parts = new Map<string, Part>()
  const owned: Array<{ dispose(): void }> = []
  let tex: CanvasTexture | undefined

  const add = (parent: Object3D, geo: BufferGeometry, mat: Material, name: string, x = 0, y = 0, z = 0): Mesh => {
    const m = new Mesh(geo, mat); m.name = name; m.position.set(x, y, z); parent.add(m); return m
  }

  for (const spec of COMPONENTS) {
    const g = new Group(); g.name = spec.id
    g.userData = { componentId: spec.id, ...spec.inspection, label: spec.label }
    const mat = (k = spec.material) => { const m = makeMaterial(k, tex); owned.push(m); return m }
    const geos = geometryFor(spec.id); geos.forEach((x) => owned.push(x))
    const mats: Material[] = []
    const use = (m: Material) => { mats.push(m); return m }

    if (spec.id === 'DisplayAssembly') {
      tex = screenTexture(BRAND.name, BRAND.tagline); owned.push(tex)
      add(g, geos[0], use(makeMaterialOwned(owned, 'cameraPlate')), 'DisplaySubstrate')
      const sp = screenPlane(6.9, 15.3, 0.65); owned.push(sp)
      add(g, sp, use(makeMaterialOwned(owned, 'display', tex)), 'DisplayScreen', 0, 0, 0.032)
    } else if (spec.id === 'Motherboard') {
      add(g, slabBox(6.6, 7.4, 0.1, owned), use(mat()), 'BoardPCB')
      const chips = mergedBoxes([[-2, 2.4, 0.07, 1.4, 1.1, 0.05], [-0.4, 0.6, 0.07, 1.1, 0.9, 0.05], [2, 2.8, 0.07, 1.2, 1.6, 0.05], [1.8, -1.4, 0.07, 1.5, 1, 0.05], [-2.1, -1.8, 0.07, 1, 1.4, 0.05], [0.2, -2.6, 0.07, 0.8, 0.5, 0.05], [-1.2, -0.3, -0.07, 1.8, 1.2, 0.05], [1.6, 0.5, -0.07, 1.2, 1.2, 0.05]]); owned.push(chips)
      add(g, chips, use(makeMaterialOwned(owned, 'shield')), 'BoardParts')
    } else if (spec.id === 'Processor') {
      add(g, slabBox(1.6, 1.6, 0.1, owned), use(mat()), 'ProcessorDie')
      add(g, slabBox(1.2, 1.2, 0.04, owned), use(makeMaterialOwned(owned, 'shield')), 'ProcessorLid', 0, 0, -0.07)
    } else if (spec.id === 'CoolingChamber') {
      add(g, geos[0], use(mat()), 'ChamberPlate')
      const pipes = mergedBoxes([[-1.1, 0, -0.05, 0.12, 5.4, 0.05], [0, 0, -0.05, 0.12, 5.4, 0.05], [1.1, 0, -0.05, 0.12, 5.4, 0.05]]); owned.push(pipes)
      add(g, pipes, use(makeMaterialOwned(owned, 'titanium')), 'ChamberFins')
    } else if (spec.id === 'CameraLenses') {
      ;[1.2, 0, -1.2].forEach((y, i) => {
        add(g, lensRing, use(makeMaterialOwned(owned, 'titanium')), `LensRing${i + 1}`, 0, y, 0)
        add(g, lensGlass, use(makeMaterialOwned(owned, 'lens')), `LensGlass${i + 1}`, 0, y, -0.01)
      })
      add(g, new CylinderGeometry(0.22, 0.22, 0.08, 16).rotateX(Math.PI / 2), use(makeMaterialOwned(owned, 'chip')), 'Flash', -1.15, 0.6, 0)
    } else if (spec.id === 'SPen') {
      add(g, geos[0], use(mat()), 'PenBody')
      const tip = new ConeGeometry(0.25, 0.7, 20).rotateX(Math.PI).translate(0, -3.05, 0); owned.push(tip)
      add(g, tip, use(makeMaterialOwned(owned, 'titanium')), 'PenTip')
      const band = new CylinderGeometry(0.265, 0.265, 0.18, 20).translate(0, 2.7, 0); owned.push(band)
      add(g, band, use(makeMaterialOwned(owned, 'titanium')), 'PenBand')
    } else {
      add(g, geos[0], use(mat()), spec.id + 'Mesh')
    }

    const base = mats.map((m) => (m as { opacity: number }).opacity)
    const p = poseOf(spec, 0)
    g.position.set(...p.position); g.rotation.set(...p.rotation)
    root.add(g)
    parts.set(spec.id, { spec, group: g, materials: mats, base })
  }
  return { root, parts, dispose: () => owned.forEach((o) => o.dispose()) }
}

function makeMaterialOwned(owned: Array<{ dispose(): void }>, key: Parameters<typeof makeMaterial>[0], tex?: CanvasTexture): Material {
  const m = makeMaterial(key, tex); owned.push(m); return m
}
function slabBox(w: number, h: number, d: number, owned: Array<{ dispose(): void }>): BufferGeometry {
  const g = new BoxGeometry(w, h, d); owned.push(g); return g
}
