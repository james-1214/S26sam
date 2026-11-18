# Galaxy S26 Ultra – cinematic product site

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
  assets/          galaxy-exploded.webp, galaxy-anatomy.webp, crops/*.png, index.ts (registry + fallbacks)
  components/      Loader, Navbar, ScrollChrome, SmartImage, AnatomyExplorer, AngleGallery, Footer
  sections/        Hero, Design, Camera, Exploded, Explore, Finale
  hooks/           useScrollScene (matchMedia + cleanup), useActiveSection, useReducedMotion
  lib/             gsap.ts, smooth.ts (Lenis), sequence.ts (shared cross-fade helper)
  data/content.ts  all copy, regions and spec flags
  styles/          global.css (tokens), layout.css (chrome), sections.css
originals/         untouched PNG originals (exploded, anatomy, 360)
```

## Assets
* **galaxy-hero.png is still missing.** Drop it into `src/assets/` (png/webp/jpg) and it is picked up
  automatically. Until then the hero/finale use a front-view crop of galaxy-360.png (~200 px wide, so it is soft on large screens).
* Front/back/side/angle/S Pen visuals are crops cut from the supplied sheets (`src/assets/crops`).
  Separate high-resolution renders would noticeably improve the Design, Camera and Gallery sections.
* Exploded and anatomy sheets ship as near-lossless WebP (q94) for size; PNG originals are in `originals/`.

## Before public launch
* Every spec shown (200MP, 6.9" AMOLED 2X 120Hz, 5000 mAh, processor naming in the graphics) comes from the supplied
  graphics and is unverified. The footer notice is controlled by `SHOW_SPEC_NOTICE` in `src/data/content.ts`.
* `CTA_URL` points to samsung.com; set the real product page.
* Fonts (Sora, Instrument Sans) load from Google Fonts. Self-host them if you need offline/GDPR-safe delivery.

## Limits (by design)
* The exploded view is a flat image: it is revealed with masks, scale and a travelling spotlight, not physically separated parts.
* The angle gallery has six fixed views. A continuous 360° spin needs a frame sequence or a GLB model (then add Three.js).
