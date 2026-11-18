import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react'
import { Menu, X } from 'lucide-react'
import { sections, sectionIds } from '../data/content'
import { useActiveSection } from '../hooks/useActiveSection'
import { lockScroll, scrollToSection } from '../lib/smooth'

export default function Navbar() {
  const active = useActiveSection(sectionIds)
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const firstLink = useRef<HTMLAnchorElement>(null)

  const close = useCallback((returnFocus = false) => {
    setOpen(false)
    if (returnFocus) toggleRef.current?.focus()
  }, [])

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('is-menu-open', open)
    lockScroll(open)
    const focusTimer = open ? window.setTimeout(() => firstLink.current?.focus(), 90) : undefined
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close(true)
    }
    window.addEventListener('keydown', onKey)
    // close the mobile menu when the layout grows to desktop
    const mq = window.matchMedia('(min-width: 900px)')
    const onMq = () => mq.matches && setOpen(false)
    mq.addEventListener('change', onMq)
    return () => {
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onMq)
      document.documentElement.classList.remove('is-menu-open')
      lockScroll(false)
    }
  }, [open, close])

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    setOpen(false)
    window.setTimeout(() => scrollToSection(id), open ? 60 : 0)
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <header className={`nav ${solid ? 'is-solid' : ''}`}>
      <a href="#overview" className="nav__brand" onClick={(e) => go(e, 'overview')} aria-label="Samsung Galaxy S26 Ultra — back to start">
        Samsung
      </a>

      <nav className="nav__links" aria-label="Sections">
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`} onClick={(e) => go(e, s.id)} aria-current={active === s.id ? 'true' : undefined}>
            {s.label}
          </a>
        ))}
      </nav>

      <button
        ref={toggleRef}
        type="button"
        className="nav__toggle"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
      </button>

      <div id="mobile-menu" className={`menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <nav aria-label="Sections (mobile)">
          {sections.map((s, i) => (
            <a
              key={s.id}
              ref={i === 0 ? firstLink : undefined}
              href={`#${s.id}`}
              tabIndex={open ? 0 : -1}
              onClick={(e) => go(e, s.id)}
              aria-current={active === s.id ? 'true' : undefined}
              style={{ transitionDelay: open ? `${80 + i * 45}ms` : '0ms' }}
            >
              {s.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
