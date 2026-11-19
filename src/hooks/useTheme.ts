import { useCallback, useEffect, useState } from 'react'

export type Theme = 'dark' | 'light'
const KEY = 'theme'
const read = (): Theme => {
  try { const v = localStorage.getItem(KEY); if (v === 'light' || v === 'dark') return v } catch { /* storage blocked */ }
  return 'dark'
}
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(read)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f4f0ff' : '#07040f')
    try { localStorage.setItem(KEY, theme) } catch { /* ignore */ }
  }, [theme])
  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])
  return [theme, toggle]
}
