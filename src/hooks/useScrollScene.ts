import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from '../lib/gsap'

export interface SceneInfo {
  isDesktop: boolean
}

/**
 * Lifecycle-safe GSAP/ScrollTrigger scene. Everything created inside `build`
 * is reverted on unmount and whenever a media condition changes.
 * When the visitor prefers reduced motion, `build` is never called and the
 * static (fully visible) layout is used.
 */
export function useScrollScene(
  scope: RefObject<HTMLElement | null>,
  build: (info: SceneInfo) => void | (() => void),
  deps: ReadonlyArray<unknown> = [],
): void {
  useLayoutEffect(() => {
    const el = scope.current
    if (!el) return
    const mm = gsap.matchMedia(el)
    mm.add(
      { motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 768px)' },
      (ctx) => {
        const c = ctx.conditions as { motion: boolean; desktop: boolean }
        if (!c.motion) return
        return build({ isDesktop: c.desktop })
      },
    )
    return () => mm.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
