import { describe, it, expect } from 'vitest'
import { ExplodeController } from '../ExplodeController'

describe('ExplodeController', () => {
  it('play() starts at from and glides to target', () => {
    const c = new ExplodeController()
    c.play(1, 0, 4)
    expect(c.progress).toBe(1)
    for (let i = 0; i < 200; i++) c.step(1 / 60)
    expect(c.progress).toBeLessThan(0.01)
  })
  it('manual control overrides until scroll moves', () => {
    const c = new ExplodeController()
    c.setManual(0.7)
    expect(c.target).toBeCloseTo(0.7)
    c.setScroll(0.2)
    expect(c.target).toBeGreaterThanOrEqual(0)
  })
})
