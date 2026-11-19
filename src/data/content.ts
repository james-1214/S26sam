import { assets, type ImageAsset } from '../assets'
import { BRAND } from './brand'

export const SHOW_SPEC_NOTICE = true
export const SPEC_NOTICE =
  'Placeholder branding and an illustrative procedural 3D model. Technical specifications will be published once verified.'
export const CTA_URL = BRAND.cta.href

export interface NavItem { id: string; label: string }
export const sections: readonly NavItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'design', label: 'Design' },
  { id: 'camera', label: 'Camera' },
  { id: 'viewer', label: '360°' },
  { id: 'inside', label: 'Exploded' },
  { id: 'explore', label: 'Anatomy' },
  { id: 'inspect', label: 'Inspect' },
  { id: 'finale', label: 'Own it' },
]
export const sectionIds = sections.map((s) => s.id)

export interface DesignPanel { id: string; title: string; body: string; image: ImageAsset }
export interface DesignPanel { id: string; title: string; body: string; image: ImageAsset; alt: string }
export const designPanels: readonly DesignPanel[] = [
  { id: 'front', title: 'A display that fills the frame', body: 'Edge to edge, with a single centred camera and almost no border.', image: assets.angleLeft, alt: `${BRAND.product}, angled from the left` },
  { id: 'back', title: 'Violet, from every angle', body: 'Deep violet metal and glass, finished in one confident colour.', image: assets.angleRight, alt: `${BRAND.product}, angled from the right` },
  { id: 'side', title: 'A flat, confident profile', body: 'Keys fall naturally under your thumb.', image: assets.right, alt: `${BRAND.product}, side profile` },
]
export const designPenCaption = {
  title: 'And a precision stylus',
  body: 'It slides out of the bottom edge, ready for writing and drawing.',
}

export interface CameraCallout { id: string; label: string; detail: string; y: number }
/** Lens centres, as a percentage of the back-panel image. x is shared (20%). */
export const cameraCallouts: readonly CameraCallout[] = [
  { id: 'main', label: 'Main camera', detail: 'Your everyday lens, tuned for light and detail.', y: 12 },
  { id: 'ultra', label: 'Ultra-wide', detail: 'Step back and keep the whole scene in frame.', y: 25 },
  { id: 'tele', label: 'Telephoto', detail: 'Reaches in for distant detail.', y: 38 },
]
export const cameraIntro = { title: 'Three lenses, one composition.', body: 'Scroll to meet each camera.' }

export interface AngleView { id: string; label: string; alt: string; image: ImageAsset }
export const angleViews: readonly AngleView[] = [
  { id: 'left', label: 'Left side', alt: `${BRAND.product}, left side`, image: assets.left },
  { id: 'right', label: 'Right side', alt: `${BRAND.product}, right side`, image: assets.right },
  { id: 'angle-left', label: 'Angle left', alt: `${BRAND.product}, angled from the left`, image: assets.angleLeft },
  { id: 'angle-right', label: 'Angle right', alt: `${BRAND.product}, angled from the right`, image: assets.angleRight },
]
