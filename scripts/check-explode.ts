import { COMPONENTS, poseOf } from '../src/three/phoneSpec'
// Verifies: assembled = original transforms, exploded = exploded transforms, no volume overlap at any progress.
const WHITELIST = new Set(['Frame|SPen']) // stylus leaves through a slot in the bottom edge
let bad = 0
const boxes = (id: string, p: number) => {
  const c = COMPONENTS.find((k) => k.id === id)!
  const { position: o } = poseOf(c, p)
  return c.bounds.map(([x, y, z, w, h, d]) => [o[0] + x - w / 2, o[0] + x + w / 2, o[1] + y - h / 2, o[1] + y + h / 2, o[2] + z - d / 2, o[2] + z + d / 2])
}
for (const c of COMPONENTS) {
  const a = poseOf(c, 0), e = poseOf(c, 1)
  const near = (u: readonly number[], v: readonly number[]) => u.every((n, i) => Math.abs(n - v[i]) < 1e-9)
  if (!near(a.position, c.position)) { console.log('assembled mismatch', c.id); bad++ }
  if (!near(e.position, c.explodedPosition)) { console.log('exploded mismatch', c.id); bad++ }
}
const seen = new Set<string>()
for (let i = 0; i <= 1000; i++) {
  const p = i / 1000
  for (let a = 0; a < COMPONENTS.length; a++) for (let b = a + 1; b < COMPONENTS.length; b++) {
    const A = COMPONENTS[a].id, B = COMPONENTS[b].id
    if (WHITELIST.has(`${A}|${B}`) || WHITELIST.has(`${B}|${A}`)) continue
    for (const x of boxes(A, p)) for (const y of boxes(B, p)) {
      const ov = [0, 2, 4].map((k) => Math.min(x[k + 1], y[k + 1]) - Math.max(x[k], y[k]))
      if (ov.every((v) => v > 0.015)) { const key = `${A}|${B}`; if (!seen.has(key)) { seen.add(key); console.log(`OVERLAP ${A} / ${B} at p=${p.toFixed(3)} depth=${ov.map((v) => v.toFixed(2))}`) ; bad++ } }
    }
  }
}
console.log(bad ? `FAIL (${bad})` : 'PASS: transforms exact, no overlaps across 1001 samples')
process.exit(bad ? 1 : 0)
