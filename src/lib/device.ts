export type Tier = 'desktop' | 'tablet' | 'mobile'
export const tierOf = (w: number): Tier => (w < 700 ? 'mobile' : w < 1100 ? 'tablet' : 'desktop')
export const prefersReduced = (): boolean => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
export function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch { return false }
}
