/**
 * Central asset registry.
 *
 * Expected files in src/assets:
 *   galaxy-hero.png      (NOT yet supplied)
 *   galaxy-exploded.webp  galaxy-anatomy.webp (PNG originals live in /originals)
 *   galaxy-360.png is kept in /originals and only used to cut the view crops in src/assets/crops
 *
 * Missing files never break the build: galaxy-hero.png falls back to a crop
 * taken from galaxy-360.png until the original product image is added.
 */
const found = import.meta.glob('./*.{png,webp,jpg}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>
/** Look up src/assets/<name>.(webp|png|jpg) */
const root = (name: string): string | undefined => found[`./${name}.webp`] ?? found[`./${name}.png`] ?? found[`./${name}.jpg`]
const crops = import.meta.glob('./crops/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>

const crop = (name: string): string | undefined => crops[`./crops/${name}.png`]

export interface ImageAsset {
  src?: string
  width: number
  height: number
}

export const heroIsFallback = !root('galaxy-hero')

export const assets = {
  hero: { src: root('galaxy-hero') ?? crop('front'), width: 204, height: 420 } satisfies ImageAsset,
  exploded: { src: root('galaxy-exploded'), width: 1254, height: 1254 } satisfies ImageAsset,
  anatomy: { src: root('galaxy-anatomy'), width: 1536, height: 1024 } satisfies ImageAsset,
  front: { src: crop('front'), width: 204, height: 420 } satisfies ImageAsset,
  back: { src: crop('back'), width: 185, height: 416 } satisfies ImageAsset,
  left: { src: crop('left'), width: 40, height: 400 } satisfies ImageAsset,
  right: { src: crop('right'), width: 48, height: 415 } satisfies ImageAsset,
  angleLeft: { src: crop('angle-left'), width: 160, height: 396 } satisfies ImageAsset,
  angleRight: { src: crop('angle-right'), width: 178, height: 401 } satisfies ImageAsset,
  spen: { src: crop('spen'), width: 68, height: 440 } satisfies ImageAsset,
}
