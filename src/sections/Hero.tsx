import { useEffect, useRef } from 'react'
import SmartImage from '../components/SmartImage'
import { assets } from '../assets'
import { gsap } from '../lib/gsap'
import { useScrollScene } from '../hooks/useScrollScene'

interface HeroProps {
  ready: boolean
}

export default function Hero({ ready }: HeroProps) {
  const root = useRef<HTMLElement>(null)
  const intro = useRef<gsap.core.Timeline | null>(null)
  const float = useRef<gsap.core.Tween | null>(null)
  const readyRef = useRef(ready)
  readyRef.current = ready

  useScrollScene(root, ({ isDesktop }) => {
    // 1. Cinematic intro (plays once the loader has finished)
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })
    tl.fromTo('.hero__glow--a', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 2 }, 0)
      .fromTo('.hero__glow--b', { opacity: 0 }, { opacity: 1, duration: 2.4 }, 0.4)
      .fromTo('.hero__brand', { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.9 }, 0.5)
      .fromTo('.hero__line > span', { yPercent: 115 }, { yPercent: 0, duration: 1.2, stagger: 0.14, ease: 'expo.out' }, 0.8)
      .fromTo('.hero__sub', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1 }, 1.5)
      .fromTo('.hero__phone', { opacity: 0, scale: 0.78, y: 70 }, { opacity: 1, scale: 1, y: 0, duration: 1.7, ease: 'expo.out' }, 1)
      .fromTo('.hero__beam', { xPercent: -140, opacity: 0 }, { xPercent: 140, opacity: 1, duration: 2.6, ease: 'power2.inOut' }, 1.6)
      .to('.hero__beam', { opacity: 0, duration: 0.8 }, 3.4)
      .fromTo('.hero__scroll', { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.9 }, 2.4)
    intro.current = tl

    // 2. Subtle floating movement on its own wrapper (no transform conflicts)
    float.current = gsap.to('.hero__float', {
      y: isDesktop ? -12 : -7,
      duration: 3.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      paused: true,
    })

    if (readyRef.current) {
      tl.progress(1)
      float.current.play()
    }

    // 3. Scroll: phone scales, headline drifts out of focus, background shifts
    gsap
      .timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
      })
      .to('.hero__scale', { scale: isDesktop ? 1.4 : 1.2, yPercent: isDesktop ? -3 : -2 }, 0)
      .to(['.hero__title', '.hero__sub'], { yPercent: -22, opacity: 0, ...(isDesktop ? { filter: 'blur(8px)' } : {}) }, 0)
      .to('.hero__glow--a', { opacity: 0.25 }, 0)
      .to('.hero__shift', { opacity: 1 }, 0)
      .to('.hero__scroll', { opacity: 0, duration: 0.15 }, 0)

    return () => {
      intro.current = null
      float.current = null
    }
  })

  useEffect(() => {
    if (!ready) return
    intro.current?.play()
    float.current?.play()
  }, [ready])

  return (
    <section id="overview" ref={root} className="hero" aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__glow hero__glow--a" />
        <div className="hero__glow hero__glow--b" />
        <div className="hero__shift" />
        <div className="hero__beam" />
      </div>

      <p className="hero__brand">Samsung</p>

      <div className="hero__text">
        <h1 id="hero-title" className="hero__title">
          <span className="hero__line"><span>Galaxy</span></span>
          <span className="hero__line"><span>S26 Ultra</span></span>
        </h1>
        <p className="hero__sub">Built around the lens, the light and the pen.</p>
      </div>

      <div className="hero__stage">
        <div className="hero__scale">
          <div className="hero__float">
            <div className="hero__phone">
              <SmartImage
                className="hero__img shot--tight"
                src={assets.hero.src}
                width={assets.hero.width}
                height={assets.hero.height}
                alt="Samsung Galaxy S26 Ultra, front view"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <a className="hero__scroll" href="#design" aria-label="Scroll to the design section">
        <span>Scroll</span>
        <i aria-hidden="true" />
      </a>
    </section>
  )
}
