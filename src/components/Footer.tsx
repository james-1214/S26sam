import { SHOW_SPEC_NOTICE, SPEC_NOTICE } from '../data/content'

export default function Footer() {
  return (
    <footer className="footer">
      <span className="footer__brand">Samsung</span>
      {SHOW_SPEC_NOTICE && <p className="footer__note">{SPEC_NOTICE}</p>}
    </footer>
  )
}
