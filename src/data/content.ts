import { assets, type ImageAsset } from '../assets'

/** Flip to false once every figure has been checked against Samsung's official specification sheet. */
export const SHOW_SPEC_NOTICE = true
export const SPEC_NOTICE =
  'Specifications and imagery come from the supplied launch graphics and must be verified before public launch.'
export const CTA_URL = 'https://www.samsung.com/'

export interface NavItem { id: string; label: string }
export const sections: readonly NavItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'design', label: 'Design' },
  { id: 'camera', label: 'Camera' },
  { id: 'inside', label: 'Inside' },
  { id: 'explore', label: 'Explore' },
  { id: 'finale', label: 'Own it' },
]
export const sectionIds = sections.map((s) => s.id)

export interface DesignPanel { id: string; title: string; body: string; image: ImageAsset }
export const designPanels: readonly DesignPanel[] = [
  { id: 'front', title: 'A display that fills the frame', body: '6.9-inch AMOLED 2X at 120Hz, edge to edge, with a single centred camera.', image: assets.front },
  { id: 'back', title: 'Glass in deep violet', body: 'Three lenses and a flash sit on one quiet panel, finished in a single colour.', image: assets.back },
  { id: 'side', title: 'A flat, confident profile', body: 'Volume and power keys fall naturally under your thumb.', image: assets.right },
]
export const designPenCaption = {
  title: 'And the S Pen',
  body: 'Included in the box, with low latency for writing and drawing.',
}

export interface CameraCallout { id: string; label: string; detail: string; y: number }
/** Lens centres, as a percentage of the back-panel image. x is shared (20%). */
export const cameraCallouts: readonly CameraCallout[] = [
  { id: 'main', label: 'Main camera', detail: '200MP with optical image stabilisation.', y: 12 },
  { id: 'ultra', label: 'Ultra-wide', detail: 'Step back and keep the whole scene in frame.', y: 25 },
  { id: 'tele', label: 'Telephoto', detail: 'A periscope design that reaches distant detail.', y: 38 },
]
export const cameraIntro = { title: 'Three lenses, one composition.', body: 'Scroll to meet each camera.' }

export const EXPLODED_CROP = { top: 150, height: 860, size: 1254 }
export interface ExplodedRegion { id: string; label: string; body: string; x: number; y: number; w: number; h: number }
export const explodedRegions: readonly ExplodedRegion[] = [
  { id: 'camera', label: 'Camera module', body: 'Main, ultra-wide and telephoto sensors packaged as a single module.', x: 276, y: 256, w: 128, h: 256 },
  { id: 'mainboard', label: 'Mainboard', body: 'The processor and supporting chips on one tightly packed board.', x: 482, y: 246, w: 124, h: 522 },
  { id: 'battery', label: 'Battery', body: 'A 5000 mAh cell takes up the heart of the chassis.', x: 598, y: 236, w: 140, h: 526 },
  { id: 'display', label: 'Display', body: 'A 6.9-inch Dynamic AMOLED 2X panel with a 120Hz refresh rate.', x: 938, y: 158, w: 214, h: 634 },
]

export interface AnatomyView { id: string; label: string; body: string; x: number; y: number; w: number; h: number }
/** Regions are in pixels of galaxy-anatomy.png (1536 × 1024). */
export const anatomyViews: readonly AnatomyView[] = [
  { id: 'overview', label: 'Overview', body: 'Every view of the phone on a single annotated sheet.', x: 0, y: 0, w: 1536, h: 1024 },
  { id: 'front', label: 'Front', body: 'An edge-to-edge display with a centred punch-hole camera.', x: 20, y: 205, w: 290, h: 590 },
  { id: 'back', label: 'Back', body: 'Three lenses stacked on glass, with flash and laser autofocus beside them.', x: 290, y: 180, w: 370, h: 620 },
  { id: 'side', label: 'Side', body: 'Volume and power keys on the right edge.', x: 600, y: 300, w: 190, h: 480 },
  { id: 'internal', label: 'Internal', body: 'Mainboard, vapor chamber and battery arranged around the camera module.', x: 725, y: 65, w: 460, h: 780 },
  { id: 'camera', label: 'Camera module', body: '200MP main, ultra-wide and periscope telephoto, plus a laser AF sensor.', x: 295, y: 180, w: 340, h: 340 },
  { id: 'display', label: 'Display', body: '6.9-inch AMOLED 2X with a 120Hz refresh rate.', x: 40, y: 225, w: 250, h: 510 },
  { id: 'spen', label: 'S Pen', body: 'Low-latency writing and drawing, with a button for quick actions.', x: 580, y: 825, w: 640, h: 190 },
]

export interface AngleView { id: string; label: string; alt: string; image: ImageAsset }
export const angleViews: readonly AngleView[] = [
  { id: 'front', label: 'Front', alt: 'Galaxy S26 Ultra, front view', image: assets.front },
  { id: 'back', label: 'Back', alt: 'Galaxy S26 Ultra, back view', image: assets.back },
  { id: 'left', label: 'Left side', alt: 'Galaxy S26 Ultra, left side', image: assets.left },
  { id: 'right', label: 'Right side', alt: 'Galaxy S26 Ultra, right side', image: assets.right },
  { id: 'angle-left', label: 'Angle left', alt: 'Galaxy S26 Ultra, angled from the left', image: assets.angleLeft },
  { id: 'angle-right', label: 'Angle right', alt: 'Galaxy S26 Ultra, angled from the right', image: assets.angleRight },
]
