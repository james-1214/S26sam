# [YOUR PHONE MODEL] – cinematic 3D product site

React 19 · Vite · TypeScript · GSAP + ScrollTrigger · Lenis · Lucide · plain CSS

```
npm install
npm run dev        # development
npm run build      # type-check + production build
npm run preview    # serve dist/
```

## Structure
```
src/
  assets/          (legacy photo fallbacks), crops/*.png, index.ts (registry + fallbacks)
  components/      Loader, Navbar, ScrollChrome, SmartImage, AnatomyExplorer, AngleGallery, Footer
  sections/        Hero, Design, Camera, Exploded, Explore, Finale
  hooks/           useScrollScene (matchMedia + cleanup), useActiveSection, useReducedMotion
  lib/             gsap.ts, smooth.ts (Lenis), sequence.ts (shared cross-fade helper)
  data/content.ts  all copy, regions and spec flags
  styles/          global.css (tokens), layout.css (chrome), sections.css
```

## Assets
* Front/back/side/angle/S Pen visuals are crops cut from the supplied sheets (`src/assets/crops`).
  Separate high-resolution renders would noticeably improve the Design, Camera and Gallery sections.

## Before public launch
* Every spec shown (200MP, 6.9" AMOLED 2X 120Hz, 5000 mAh, processor naming in the graphics) comes from the supplied
  graphics and is unverified. The footer notice is controlled by `SHOW_SPEC_NOTICE` in `src/data/content.ts`.
* `CTA_URL` is a placeholder; set your real product page.
* Fonts (Sora, Instrument Sans) load from Google Fonts. Self-host them if you need offline/GDPR-safe delivery.

## Limits (by design)
* The exploded view is a flat image: it is revealed with masks, scale and a travelling spotlight, not physically separated parts.
* The angle gallery has six fixed views. A continuous 360° spin needs a frame sequence or a GLB model (then add Three.js).

## Combined version — what's new
- **Loading sequence (GSAP):** counter + layered phone stack driven by real readiness (fonts, 3D chunk, first model build), then a curtain lift; hero intro plays underneath.
- **Real-time explode:** the 3D phone assembles from exploded on load; an **Explode slider** (0–100 %) plus Assemble/Explode toggle share one `ExplodeController`. Scroll and manual input arbitrate there; GSAP never writes component transforms.
- **Scroll animation:** hero turntable, Design section is a real 3D turntable (front → back → side → stylus isolate) via a GSAP "script" channel that only offsets the camera/turntable.
- Photo-based "Every angle" gallery only appears when WebGL is unavailable.
- `npm test` (vitest) and `npm run check:explode`.

## Honest limits
Model is procedural and illustrative (not an authentic device model). Brand text is placeholder (`src/data/brand.ts`). No GLB loader yet (`ModelLoader` is the hook). Verified only on software WebGL, not real GPUs/phones.
