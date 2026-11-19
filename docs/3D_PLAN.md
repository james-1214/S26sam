# [YOUR PHONE MODEL] — 3D Upgrade: Audit + Implementation Plan

Status: audit complete, **no project files modified** (zip extracted to a scratch copy only).

---

## 1. Audit

### 1.1 Stack (as shipped)
| Item | Version / note |
|---|---|
| React / ReactDOM | ^19.3.1 (StrictMode on) |
| Vite / TS | ^8.3.8 / ^7.0.2, `strict`, `noUnusedLocals` |
| GSAP + ScrollTrigger | ^3.15.1 |
| Lenis | ^1.3.27, driven from `gsap.ticker` |
| lucide-react | icons |
| three / R3F / drei | **not installed** (R3F peer range `react >=19 <19.4` fits) |
| Router | **none**. Single page; "routes" are hash anchors `#overview #design #camera #inside #explore #finale` |
| Tests / lint | none |

~1,600 lines. Plain CSS (`global.css` tokens, `layout.css` chrome, `sections.css`).

### 1.2 Existing functionality (must be preserved)
- **Loader** – min 1.1 s, waits for fonts + hero image, 4 s timeout, reduced-motion shortens.
- **Navbar** – desktop links + mobile menu (focus management, Esc, scroll lock via Lenis), active section via IntersectionObserver, `scrollToSection` resolves pinned ScrollTrigger starts.
- **ScrollChrome** – progress bar + back-to-top (direct DOM writes).
- **Footer** – spec-verification notice (`SHOW_SPEC_NOTICE`).
- **Hero** – intro timeline, float tween, scroll scale/blur.
- **Design** (pinned, 320%) – cross-fades front/back/side PNGs + S Pen.
- **Camera** (pinned, 300%) – zoom on back PNG, callouts at hard-coded `%` positions.
- **Exploded** (pinned, 400%) – assembled PNG → mask-reveal of exploded WebP, travelling spotlight over 4 hard-coded pixel regions, captions + chips.
- **Explore** – `AnatomyExplorer` (ARIA tabs, arrow/Home/End, zoom into sheet) and `AngleGallery` (6 fixed images, swipe/arrow keys).
- **Finale** – anatomy → exploded → phone cross-fade, CTA.
- **Infra** – `useScrollScene` (gsap.matchMedia, reduced-motion = no scenes, static layout), `useReducedMotion`, `SmartImage` (fallback box on error), `sequence()` helper, asset registry with graceful fallbacks, `data/content.ts` as single copy source.
- **Accessibility** – labelled sections, `aria-live` captions, keyboard tabs/carousel, reduced-motion respected, skip-safe fallbacks.

### 1.3 Image-based product interactions (replacement candidates)
| Where | Current | 3D replacement |
|---|---|---|
| Hero | 204 px-wide front crop (hero PNG missing) | 3D phone, front pose |
| Design | cross-fade of 3 flat crops | camera presets Front/Back/Side on one model |
| Camera | scale on `back.png`, `%` callouts | camera zoom to CameraSystem node, anchored labels |
| Exploded | mask reveal of flat sheet | real explode driven by `explosionProgress` |
| AngleGallery | 6 fixed stills | camera presets + free orbit |
| AnatomyExplorer | zoom into a sheet | per-component inspect/isolate |
| Finale | cross-fade stills | explode→assemble on the same model |

**Keep as-is:** Loader, Navbar, ScrollChrome, Footer, all copy in `content.ts`, tokens/CSS, `SmartImage` (becomes the fallback layer).

### 1.4 Gaps / risks found
1. **No 3D asset at all.** No GLB, no CAD, no reference drawings with dimensions. Only flat renders, and crops are tiny (≈40–200 px wide) – unusable as textures.
2. Hero image is not needed (3D model replaces it).
3. Specs in copy (200 MP, 6.9", 5000 mAh, etc.) are **unverified**, taken from supplied graphics.
4. **Scroll architecture conflict:** each section owns a *pinned* scrubbed timeline. A 3D scene that must persist across sections cannot live inside any one of them, and GSAP must not tween Three object transforms directly (the rule you set).
5. **Pointer conflict:** Lenis smooth scroll vs. drag-to-rotate on touch. Needs `touch-action: pan-y` and horizontal-intent detection.
6. **StrictMode double-mount** will create/dispose WebGL resources twice in dev.
7. **WebGL contexts:** one Canvas per section would exhaust mobile GPU contexts.
8. Bundle: three + R3F adds roughly 150–250 KB gz; must be lazy-loaded.
9. Blender is **not installed** in this workspace. `bpy` is on PyPI (5.x listed) so headless generation may be possible, but I have not tested installing/running it; I will not assume it.

---

## 2. Model plan

### 2.1 Honesty statement
Whatever is produced is a **[brand]-inspired, procedurally/hand-modelled approximation**, not [brand] CAD and not an authentic engineering model. Dimensions are placeholders (~163 × 78 × 8 mm class, unverified). UI copy and README will say so.

### 2.2 Required hierarchy (GLB node names = component IDs)
```
S26Root
├─ Frame            ├─ Motherboard      ├─ Battery
├─ FrontGlass       ├─ Processor        ├─ InternalShield
├─ DisplayAssembly  ├─ CoolingChamber   ├─ FlexCables
├─ RearGlass        ├─ CameraSystem     └─ SPen
```
Sub-nodes allowed (e.g. `CameraSystem/Lens_Main`), but explode/inspect operate on the 12 top-level IDs.

### 2.3 Per-component contract (TypeScript)
```ts
interface ComponentSpec {
  id: ComponentId                 // unique, == GLB node name
  assembled: Pose                 // position[3], rotation quat/euler, scale
  exploded: Pose
  window: [number, number]        // sub-range of explosionProgress (stagger), default [0,1]
  materialKey: MaterialKey        // glass | titanium | amoled | pcb | silicon | copper | cell | foil | flex | pen
  inspect: { title; body; role; layerOrder; specs? }   // copy, flagged unverified
  visible: boolean                // runtime state (store), not baked
}
```
- **Assembled transform** = node rest transform read from GLB at load (source of truth) and frozen.
- **Exploded transform** = `src/model/manifest.ts` (authored once; also written to glTF `extras` by the Blender script so the two can be validated against each other).
- Material: shared PBR library in code (GLB supplies geometry + names; materials are re-bound by `materialKey` so we can tune look and avoid heavy textures).

### 2.4 Model creation paths (in order of preference)
1. **Blender (bpy headless) generator script** `tools/blender/build_s26.py` → builds the 12 parts (rounded-box frame with bevels, glass with curvature, camera lenses via cylinders/rings, PCB, battery, etc.), names nodes, sets exploded offsets in `extras`, exports `s26.glb` with Draco/meshopt via `gltf-transform`. Attempted only if `bpy` installs here; otherwise the script is delivered for you to run in Blender locally.
2. **Procedural Three.js prototype** (Phase 2, always built first): same IDs, same manifest, `RoundedBoxGeometry`, `ExtrudeGeometry`, cylinders. Clearly labelled "Prototype geometry".
3. **Hand-modelled GLB** (you or an artist) dropped in later: loader validates names against the manifest, so no code changes.

The viewer consumes one interface (`<PhoneModel source="procedural" | "glb">`), so swapping 1/2/3 changes nothing else.

---

## 3. Architecture

### 3.1 Single transform controller (critical rule)
```
 inputs (never touch objects)            controller                     renderer
 ┌──────────────────────────┐   ┌────────────────────────────┐   ┌──────────────────┐
 │ ScrollTrigger (onUpdate) │──▶│ explosionStore              │   │ useFrame:         │
 │ Assemble/Explode button  │──▶│  target ∈[0,1]  source      │──▶│ progress = damp() │
 │ Slider / keyboard        │──▶│  progress ∈[0,1] (smoothed) │   │ applyPose(progress)│
 │ Inspect / reduced-motion │──▶│  mode: 'scroll'|'manual'    │   │ ONLY writer of     │
 └──────────────────────────┘   └────────────────────────────┘   │ object3D transforms│
                                                                  └──────────────────┘
```
- `explosionProgress` (0 assembled → 1 exploded) lives in a tiny external store (`useSyncExternalStore`; no new dependency). Read imperatively in `useFrame`, so no React re-renders per frame.
- **Arbitration (prevents fighting):**
  - `mode = 'scroll'`: ScrollTrigger `onUpdate` writes `target = self.progress`.
  - Manual button/slider sets `mode = 'manual'` and tweens `target` (a GSAP tween on the *store value*, not on 3D objects).
  - Returning to scroll control happens only on a real user scroll *inside the exploded section*; the handoff eases from the current value (no jump).
  - Outside that section the scroll input is not bound, so the button always works.
- `applyPose(progress)`: for each component, `t = easeInOut(remap(progress, window))`; `position = lerp`, `quaternion = slerp`, `scale = lerp`. It is the **only** code that writes component transforms. GSAP never references a Three object.
- Camera presets, zoom and auto-rotate use a separate **camera controller** (orbit state), also store-driven, so they cannot disturb part transforms.
- Rotation of the whole device is applied on a parent `S26Root` group (orbit or model-yaw), parts stay in local space; explode and spin are therefore independent.

### 3.2 Canvas strategy
- **One persistent, lazy-loaded `<Canvas>`** (`React.lazy`) in a fixed layer behind sections, `frameloop="demand"` when idle, invalidated by the store, DPR capped (`[1, 1.5]` mobile, `[1, 2]` desktop), paused via IntersectionObserver / `visibilitychange`.
- Sections declare a **scene beat** (camera pose + explosion range + visible components) via `data/scenes.ts`; ScrollTrigger sections remain as layout/text pins (preserved), but their timelines now write to the store instead of animating images.
- Alternative if the persistent layer causes layout trouble: drei `<View>` per section sharing one context. Decided at the Phase 4 spike.

### 3.3 Fallback & loading
- Existing `SmartImage` stills stay in the DOM until the 3D scene reports `ready`; then cross-fade out. Failure paths (no WebGL, context lost, `Save-Data`, very low-end) leave the current site unchanged.
- Loader keeps working; add `model ready` as an optional, time-boxed wait (≤4 s existing timeout).

### 3.4 Viewer features → implementation
| Requirement | Implementation |
|---|---|
| Continuous 360° | root yaw unbounded (no clamp) |
| Mouse + touch drag | pointer events on canvas, inertia; `touch-action: pan-y` so vertical swipes still scroll; Lenis `data-lenis-prevent` on active drag |
| Auto-rotate ON/OFF | store flag; paused on user drag, resumes after idle; off under reduced motion |
| Angle presets | Front / Back / Left / Right / Angle L / Angle R / Top – reuse `angleViews` ids; camera tween |
| Zoom | wheel/pinch/buttons, clamped distance; wheel zoom only while canvas is focused so page scroll isn't hijacked |
| Independent parts | 12 named groups, see 3.1 |
| Assemble/Explode toggle | button + `aria-pressed`, same store |
| Scroll-controlled explode | ScrollTrigger → store |
| Inspect | click/tap or chip → isolate (others dim to 15% opacity, camera frames part, panel shows `inspect` metadata) |
| Visibility state | per-component toggles (checklist), store-backed |
| Storytelling | `scenes.ts` beats mapped to existing sections' copy |

### 3.5 Accessibility, mobile, performance, reduced motion
- Canvas is `role="img"` with label; **all controls are real buttons** with keyboard support (arrows rotate, +/- zoom, Space toggles explode, number keys select presets). Part list is a keyboard-accessible list mirroring the 3D picks.
- `prefers-reduced-motion`: no auto-rotate, no scroll scrub of the model, explode/assemble and presets jump instantly, drag still works.
- Mobile: lower DPR, no shadows, simplified environment (baked small HDR/`Lightformer`s), ≤150 k tris total budget, shared geometries, `Draco/meshopt` for GLB, disposal on unmount.
- Budget targets: 3D chunk lazy, initial JS unchanged for first paint; steady 60 fps on mid phones, idle frames = 0 when nothing animates.

---

## 4. Phased plan

| Phase | Output | Exit criterion |
|---|---|---|
| **0 – Baseline** | `npm i`, `npm run build`, Lighthouse + screenshots of every section; this audit committed as `docs/` | build green, baseline recorded |
| **1 – Data + controller (no visuals)** | `src/model/{components.ts, manifest.ts, poses.ts, store.ts}`; `applyPose`; Vitest unit tests (progress 0 = assembled, 1 = exploded, scroll+manual never write the same value in the same frame, windows/stagger) | tests pass; controller proven before any rendering |
| **2 – Procedural prototype** | add `three`, `@react-three/fiber`, `@types/three` (+ drei only if needed, imported per-component); 12 separate meshes, shared materials, visibility states, labelled "prototype" | all 12 parts move independently on a dev page `/?lab=3d` (hash/query, no router change) |
| **3 – Viewer controls** | orbit/drag/touch, inertia, auto-rotate, presets, zoom, assemble/explode button, inspect panel, keyboard + reduced-motion | all 11 required features work standalone |
| **4 – Scroll integration** | replace Exploded section's image stage with the persistent canvas; ScrollTrigger → store; manual↔scroll arbitration | button works at any scroll position; no jitter at handoff |
| **5 – Progressive replacement** | behind flag `VITE_3D`: Hero → Design → Camera → Explore (gallery+anatomy) → Finale. Each section keeps its image path as fallback | each swap shippable alone; nav/anchors/pins unchanged |
| **6 – GLB pipeline** | Blender script (or provided model), gltf-transform optimise, name validation, loader with `useGLTF`, swap `source="glb"` | GLB passes validator: 12 IDs, rest transforms, tri budget |
| **7 – Hardening** | WebGL-lost handling, StrictMode disposal, iOS Safari/Android mid-tier tests, a11y audit, bundle report, README + limits text | Lighthouse a11y ≥ baseline, no console errors, fallback verified with WebGL disabled |

Not touched in any phase: routes/anchors, Navbar, Footer, Loader logic, tokens, `content.ts` copy (only additive fields).

---

## 5. Open items (need your input before Phase 6, not before Phase 1–3)
1. Do you have Blender locally / any reference drawings or a licensed model? If not, Phase 6 uses my generator script and the result stays an approximation.
2. Okay to add `vitest` as a dev dependency for controller tests?
3. Confirm the spec claims will be verified (or removed) before launch; the 3D `inspect` copy will carry the same unverified flag.

**Recommended next step:** approve Phases 1–3 (controller + procedural prototype + viewer controls) as one block.
