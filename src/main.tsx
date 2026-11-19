import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'lenis/dist/lenis.css'
import './styles/global.css'
import './styles/layout.css'
import './styles/sections.css'
import './styles/three.css'
import App from './App'

// We own scroll restoration so pinned scenes never start mid-animation.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
window.scrollTo(0, 0)
document.documentElement.classList.add('is-loading')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
