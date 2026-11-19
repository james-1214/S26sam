/**
 * The ONE owner of explosionProgress (0 = assembled, 1 = exploded).
 * Scroll (GSAP) and manual buttons only ever call setScroll / setManual; neither touches a mesh.
 * PhoneModel reads `progress` once per frame and is the only code that writes component transforms.
 * Manual override holds until the visitor scrolls again.
 */
export class ExplodeController {
  progress = 0
  target = 0
  mode: 'scroll' | 'manual' = 'scroll'
  reduced = false
  /** Damping rate (1/s). Default 7 feels instant-but-smooth; play() lowers it for cinematic moves. */
  rate = 7
  private scrollValue = 0
  private listeners = new Set<() => void>()

  /** Cinematic move (intro, scripted beats): jump to `from`, then glide to `to` at `rate`. */
  play(from: number, to: number, rate = 2): void {
    this.progress = from
    this.target = to
    this.rate = this.reduced ? 7 : rate
    this.mode = 'scroll'
    this.emit()
  }

  setScroll(v: number): void {
    const moved = Math.abs(v - this.scrollValue) > 0.003
    this.scrollValue = v
    if (this.mode === 'manual') {
      if (!moved) return
      this.mode = 'scroll'
    }
    this.target = v
    this.rate = 7
    this.emit()
  }

  setManual(v: number): void {
    this.mode = 'manual'
    this.rate = 7
    this.target = Math.min(1, Math.max(0, v))
    this.emit()
  }

  /** Advance the damped value. Returns true when progress changed. */
  step(dt: number): boolean {
    const d = this.target - this.progress
    if (Math.abs(d) < 0.0004) {
      if (d === 0) return false
      this.progress = this.target
      this.rate = 7
      return true
    }
    this.progress = this.reduced ? this.target : this.progress + d * (1 - Math.exp(-dt * this.rate))
    return true
  }

  /** 'assembled' | 'exploded' | 'between', for button state. */
  get state(): 'assembled' | 'exploded' | 'between' {
    return this.target < 0.02 ? 'assembled' : this.target > 0.98 ? 'exploded' : 'between'
  }

  subscribe = (fn: () => void): (() => void) => {
    this.listeners.add(fn)
    return () => { this.listeners.delete(fn) }
  }
  private emit(): void { this.listeners.forEach((fn) => fn()) }
}
