/**
 * Central asset registry.
 *
 * Only the supplied crops that carry no third-party branding are bundled (side and angled views).
 *
 * The hero fallback (shown only when WebGL is unavailable) reuses an angled crop.
 */
const crops = import.meta.glob('./crops/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>
const crop = (name: string): string | undefined => crops[`./crops/${name}.png`]

export interface ImageAsset {
  src?: string
  width: number
  height: number
}

export const assets = {
  hero: { src: crop('angle-right'), width: 178, height: 401 } satisfies ImageAsset,
  left: { src: crop('left'), width: 40, height: 400 } satisfies ImageAsset,
  right: { src: crop('right'), width: 48, height: 415 } satisfies ImageAsset,
  angleLeft: { src: crop('angle-left'), width: 160, height: 396 } satisfies ImageAsset,
  angleRight: { src: crop('angle-right'), width: 178, height: 401 } satisfies ImageAsset,
}
