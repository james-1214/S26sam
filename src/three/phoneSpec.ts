/**
 * Single source of truth for the procedural phone: names, assembled/exploded
 * transforms, staging windows, collision boxes and inspection metadata.
 * Units are centimetres. +Z is the front of the phone, +Y is up.
 * This is an ORIGINAL illustrative model, not a manufacturer engineering model.
 */
export type V3 = readonly [number, number, number]
/** Axis-aligned local box: centre x, y, z then width, height, depth. */
export type Box = readonly [number, number, number, number, number, number]
export type MaterialKey =
  | 'titanium' | 'glass' | 'display' | 'rear' | 'cameraPlate' | 'lens' | 'board'
  | 'chip' | 'copper' | 'battery' | 'shield' | 'flex' | 'pen'

export const PHONE = { width: 7.8, height: 16.3, depth: 0.85, wall: 0.3 } as const
export const INNER = { width: PHONE.width - 2 * PHONE.wall, height: PHONE.height - 2 * PHONE.wall } as const // 7.2 x 15.7

export interface Inspection {
  role: string
  materialNote: string
  layer: number
  description: string
  spec: string
}

export interface ComponentSpec {
  id: string
  label: string
  material: MaterialKey
  position: V3
  rotation: V3
  explodedPosition: V3
  explodedRotation: V3
  /** Explosion-progress window [start, end] in which this part travels. */
  window: readonly [number, number]
  /** z-first: slides along Z before moving sideways, so it never cuts through the chassis. */
  order: 'linear' | 'z-first'
  anchor: V3
  bounds: readonly Box[]
  inspection: Inspection
}

const SPEC_PENDING = 'Final specification pending'
const insp = (layer: number, role: string, materialNote: string, description: string): Inspection =>
  ({ layer, role, materialNote, description, spec: SPEC_PENDING })

export const COMPONENTS: readonly ComponentSpec[] = [
  {
    id: 'Frame', label: 'Titanium frame', material: 'titanium',
    position: [0, 0, 0], rotation: [0, 0, 0], explodedPosition: [0, 0, 0], explodedRotation: [0, 0, 0],
    window: [0, 1], order: 'linear', anchor: [3.95, 5, 0],
    bounds: [[-3.75, 0, 0, 0.3, 16.3, 0.85], [3.75, 0, 0, 0.3, 16.3, 0.85], [0, 8, 0, 7.2, 0.3, 0.85], [0, -8, 0, 7.2, 0.3, 0.85]],
    inspection: insp(0, 'Structural chassis', 'Brushed violet-titanium finish (illustrative)', 'The rigid outer ring that holds every layer in place, carries the buttons and anchors the glass front and back.'),
  },
  {
    id: 'FrontGlass', label: 'Front glass', material: 'glass',
    position: [0, 0, 0.4], rotation: [0, 0, 0], explodedPosition: [0, 0, 10.8], explodedRotation: [0, 0, 0],
    window: [0.05, 0.16], order: 'linear', anchor: [-3.2, 7.2, 0],
    bounds: [[0, 0, 0, 7.2, 15.7, 0.06]],
    inspection: insp(1, 'Protective cover', 'Tempered cover glass with an oleophobic coating (illustrative)', 'A clear protective layer that sits over the display and takes every touch.'),
  },
  {
    id: 'DisplayAssembly', label: 'Display', material: 'display',
    position: [0, 0, 0.32], rotation: [0, 0, 0], explodedPosition: [0, 0, 8], explodedRotation: [0, 0, 0],
    window: [0.14, 0.26], order: 'linear', anchor: [3.2, 6, 0],
    bounds: [[0, 0, 0, 7, 15.4, 0.06]],
    inspection: insp(2, 'Light-emitting panel', 'OLED stack with touch layer (illustrative)', 'The panel that produces the image, bonded to a touch layer and driven from the edge by a flexible connector.'),
  },
  {
    id: 'InternalShield', label: 'Internal shield', material: 'shield',
    position: [0, 0, 0.2], rotation: [0, 0, 0], explodedPosition: [0, 0, 5.4], explodedRotation: [0, 0, 0],
    window: [0.24, 0.34], order: 'linear', anchor: [-3.2, -1, 0],
    bounds: [[0, 0, 0, 7, 15.4, 0.04]],
    inspection: insp(3, 'Mid-plate and shielding', 'Stamped metal plate (illustrative)', 'A ribbed plate that stiffens the phone and shields the display from the electronics behind it.'),
  },
  {
    id: 'FlexCables', label: 'Flex cables', material: 'flex',
    position: [0, 0.3, 0.15], rotation: [0, 0, 0], explodedPosition: [0, 0.3, 4], explodedRotation: [0, 0, 0],
    window: [0.5, 0.62], order: 'z-first', anchor: [2, 0, 0],
    bounds: [[0, 0, 0, 4, 0.5, 0.03]],
    inspection: insp(4, 'Interconnect', 'Polyimide flexible circuit (illustrative)', 'Thin folding circuits that link the mainboard to the battery and display.'),
  },
  {
    id: 'Motherboard', label: 'Motherboard', material: 'board',
    position: [0, 4.1, 0.03], rotation: [0, 0, 0], explodedPosition: [0, 5.3, 2.8], explodedRotation: [0, 0, 0],
    window: [0.5, 0.62], order: 'z-first', anchor: [-2.6, 2.2, 0],
    bounds: [[0, 0, 0, 6.6, 7.4, 0.1]],
    inspection: insp(5, 'Main logic board', 'Multi-layer circuit board with surface-mount parts (illustrative)', 'Carries the processor, memory and radios on one compact board placed above the battery.'),
  },
  {
    id: 'Processor', label: 'Processor', material: 'chip',
    position: [0.6, 4.6, -0.07], rotation: [0, 0, 0], explodedPosition: [0.6, 5.8, 0.9], explodedRotation: [0, 0, 0],
    window: [0.6, 0.7], order: 'z-first', anchor: [0, 1, 0],
    bounds: [[0, 0, 0, 1.6, 1.6, 0.1]],
    inspection: insp(6, 'System-on-chip', 'Silicon die under a metal lid (illustrative)', 'The chip that runs the operating system, the camera pipeline and graphics.'),
  },
  {
    id: 'CoolingChamber', label: 'Cooling chamber', material: 'copper',
    position: [0.6, 3.8, -0.15], rotation: [0, 0, 0], explodedPosition: [0.6, 3.8, -3.6], explodedRotation: [0, 0, 0],
    window: [0.68, 0.8], order: 'linear', anchor: [1.6, 2.2, 0],
    bounds: [[0, 0, 0, 4.2, 6, 0.06]],
    inspection: insp(7, 'Heat spreader', 'Copper-toned vapour chamber (illustrative)', 'A thin chamber that draws heat away from the processor and spreads it across the back of the phone.'),
  },
  {
    id: 'Battery', label: 'Battery', material: 'battery',
    position: [-0.4, -3.7, -0.08], rotation: [0, 0, 0], explodedPosition: [-0.4, -6.7, -1.8], explodedRotation: [0, 0, 0],
    window: [0.78, 0.9], order: 'z-first', anchor: [-2, -2, 0.2],
    bounds: [[0, 0, 0, 5.8, 8.2, 0.4]],
    inspection: insp(8, 'Power cell', 'Pouch cell in a protective wrap (illustrative)', 'Fills the lower half of the chassis, where it can be as large as possible and keep weight centred.'),
  },
  {
    id: 'CameraSystem', label: 'Camera system', material: 'cameraPlate',
    position: [2, 5.6, -0.29], rotation: [0, 0, 0], explodedPosition: [2, 5.6, -5.6], explodedRotation: [0, 0, 0],
    window: [0.4, 0.52], order: 'linear', anchor: [-1.9, 1.6, 0],
    bounds: [[0, 0, 0, 3, 4.2, 0.16]],
    inspection: insp(9, 'Camera module carrier', 'Dark composite carrier plate (illustrative)', 'The carrier that holds the sensors and optics in alignment behind the rear glass.'),
  },
  {
    id: 'RearGlass', label: 'Rear glass', material: 'rear',
    position: [0, 0, -0.4], rotation: [0, 0, 0], explodedPosition: [0, 0, -7.8], explodedRotation: [0, 0, 0],
    window: [0.3, 0.42], order: 'linear', anchor: [2.6, -5, 0],
    bounds: [[0, 0, 0, 7.2, 15.7, 0.06]],
    inspection: insp(10, 'Back cover', 'Deep violet glass with a satin finish (illustrative)', 'The finished violet back panel. It carries the brand colour and leaves openings for the lenses.'),
  },
  {
    id: 'CameraLenses', label: 'Camera lenses', material: 'lens',
    position: [2, 5.6, -0.49], rotation: [0, 0, 0], explodedPosition: [2, 5.6, -9.8], explodedRotation: [0, 0, 0],
    window: [0.3, 0.42], order: 'linear', anchor: [-1.4, 1.2, 0],
    bounds: [[0, 1.2, 0, 1.2, 1.2, 0.1], [0, 0, 0, 1.2, 1.2, 0.1], [0, -1.2, 0, 1.2, 1.2, 0.1], [-1.15, 0.6, 0, 0.5, 0.5, 0.08]],
    inspection: insp(11, 'Optics', 'Coated glass elements in metal rings (illustrative)', 'Three lens barrels and a flash arranged on one calm camera island.'),
  },
  {
    id: 'SPen', label: 'Precision stylus', material: 'pen',
    position: [3, -4.2, -0.08], rotation: [0, 0, 0], explodedPosition: [3, -11.5, -0.08], explodedRotation: [0, 0, 0],
    window: [0.84, 0.94], order: 'linear', anchor: [0.9, 1.5, 0],
    bounds: [[0, 0, 0, 0.5, 6.6, 0.5]],
    inspection: insp(12, 'Stylus', 'Anodised aluminium barrel (illustrative)', 'A slim stylus that slides out of the bottom edge for writing and drawing.'),
  },
]

export const COMPONENT_IDS = COMPONENTS.map((c) => c.id)
export const byId = (id: string): ComponentSpec | undefined => COMPONENTS.find((c) => c.id === id)

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
export const smooth = (t: number) => t * t * (3 - 2 * t)
const mix = (a: number, b: number, t: number) => a + (b - a) * t
const mix3 = (a: V3, b: V3, tx: number, ty: number, tz: number): [number, number, number] =>
  [mix(a[0], b[0], tx), mix(a[1], b[1], ty), mix(a[2], b[2], tz)]

/** Pure transform for one component at explosion progress p (0 = assembled, 1 = exploded). */
export function poseOf(c: ComponentSpec, p: number): { position: [number, number, number]; rotation: [number, number, number] } {
  const t = clamp01((p - c.window[0]) / (c.window[1] - c.window[0]))
  const e = smooth(t)
  const ez = c.order === 'z-first' ? smooth(clamp01(t / 0.6)) : e
  const exy = c.order === 'z-first' ? smooth(clamp01((t - 0.4) / 0.6)) : e
  return { position: mix3(c.position, c.explodedPosition, exy, exy, ez), rotation: mix3(c.rotation, c.explodedRotation, e, e, e) }
}

/** Whole-model scale while exploding so the stack stays in frame. */
export const explodedScale = (p: number): number => 1 - 0.5 * p

/* ───────── Scroll story ───────── */
export interface StoryStep { key: string; title: string; body: string; ids: readonly string[]; until: number }
export const STORY: readonly StoryStep[] = [
  { key: 'assembled', title: 'Fully assembled', body: 'One object, eleven layers. Scroll to open it.', ids: [], until: 0.05 },
  { key: 'front', title: 'Front glass lifts away', body: 'The cover glass separates first, leaving the display exposed.', ids: ['FrontGlass'], until: 0.16 },
  { key: 'display', title: 'Display moves forward', body: 'The panel and its internal shield come off the chassis.', ids: ['DisplayAssembly', 'InternalShield'], until: 0.3 },
  { key: 'rear', title: 'Rear glass separates', body: 'The back panel and its lens trims travel backwards together.', ids: ['RearGlass', 'CameraLenses'], until: 0.42 },
  { key: 'camera', title: 'Camera assembly moves outward', body: 'The camera carrier slides out of its pocket.', ids: ['CameraSystem'], until: 0.52 },
  { key: 'board', title: 'Motherboard appears', body: 'The logic board and its flex cables rise clear of the frame.', ids: ['Motherboard', 'FlexCables'], until: 0.62 },
  { key: 'cpu', title: 'Processor becomes visible', body: 'The system-on-chip sits behind the board, under the heat spreader.', ids: ['Processor'], until: 0.7 },
  { key: 'cool', title: 'Cooling chamber separates', body: 'A thin chamber that moves heat away from the processor.', ids: ['CoolingChamber'], until: 0.8 },
  { key: 'battery', title: 'Battery drops down', body: 'The battery slides back and down; the stylus leaves through the bottom edge.', ids: ['Battery', 'SPen'], until: 0.94 },
  { key: 'full', title: 'Full exploded view', body: 'Every part, in the order it goes together.', ids: COMPONENT_IDS, until: 1.01 },
]
export const REASSEMBLY: StoryStep = { key: 'reassemble', title: 'Reassembly', body: 'Everything returns to its exact place.', ids: [], until: 2 }
export const HOLD_END = 0.8
export const PAUSE_END = 0.88

/** Maps scroll progress s (0–1) to explosion progress p: build-up, short hold, then linear reassembly. */
export const scrollToExplosion = (s: number): number =>
  s <= HOLD_END ? s / HOLD_END : s <= PAUSE_END ? 1 : clamp01(1 - (s - PAUSE_END) / (1 - PAUSE_END))
export function storyIndex(s: number): number {
  if (s > PAUSE_END) return STORY.length
  const p = s / HOLD_END
  const i = STORY.findIndex((st) => Math.min(p, 1) < st.until)
  return i === -1 ? STORY.length - 1 : i
}
