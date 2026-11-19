import { gsap } from './gsap'

export interface SequenceOptions {
  at?: number
  gap?: number
  fade?: number
  hidden: gsap.TweenVars
  shown: gsap.TweenVars
  exitLast?: boolean
}

/**
 * Cross-fades a list of items one after another on a (scrubbed) timeline.
 * Item 0 starts visible. Every later item enters exactly when the previous exits,
 * so the sequence reverses cleanly when scrolling upward.
 */
export function sequence(tl: gsap.core.Timeline, items: Element[], o: SequenceOptions): void {
  const { at = 0, gap = 1, fade = 0.4, hidden, shown, exitLast = false } = o
  items.forEach((el, i) => {
    const t = at + i * gap
    if (i === 0) gsap.set(el, shown)
    else {
      gsap.set(el, hidden)
      tl.to(el, { ...shown, duration: fade, ease: 'power2.out' }, t)
    }
    if (i < items.length - 1 || exitLast) {
      tl.to(el, { ...hidden, duration: fade, ease: 'power2.in' }, t + gap)
    }
  })
}
