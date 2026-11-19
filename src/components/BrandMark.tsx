import { BRAND } from '../data/brand'

/** Original text-and-glyph logo treatment. Swap for a supplied logo asset when the identity is final. */
export default function BrandMark({ full = false }: { full?: boolean }) {
  return (
    <span className="mark">
      <svg className="mark__glyph" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M6 15.5 12 5l6 10.5" fill="none" stroke="var(--violet-soft)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{full ? BRAND.name : BRAND.mark}</span>
    </span>
  )
}
