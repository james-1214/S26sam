import { useCallback, useEffect, useState } from 'react'
import Loader from './components/Loader'
import Navbar from './components/Navbar'
import ScrollChrome from './components/ScrollChrome'
import Footer from './components/Footer'
import Hero from './sections/Hero'
import Design from './sections/Design'
import Camera from './sections/Camera'
import Exploded from './sections/Exploded'
import Viewer from './sections/Viewer'
import Explore from './sections/Explore'
import Inspect from './sections/Inspect'
import Finale from './sections/Finale'
import { useReducedMotion } from './hooks/useReducedMotion'
import { startSmoothScroll, stopSmoothScroll } from './lib/smooth'
import { ScrollTrigger } from './lib/gsap'

export default function App() {
  const reduced = useReducedMotion()
  const [ready, setReady] = useState(false)
  const onDone = useCallback(() => setReady(true), [])

  useEffect(() => {
    if (reduced) return
    startSmoothScroll()
    return stopSmoothScroll
  }, [reduced])

  useEffect(() => {
    if (!ready) return
    document.documentElement.classList.remove('is-loading')
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('load', onLoad)
    }
  }, [ready])

  return (
    <>
      <Loader onDone={onDone} />
      <ScrollChrome />
      <Navbar />
      <main>
        <Hero ready={ready} />
        <Design />
        <Camera />
        <Viewer />
        <Exploded />
        <Explore />
        <Inspect />
        <Finale />
      </main>
      <Footer />
    </>
  )
}
