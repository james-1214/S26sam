import { CanvasTexture, Color, MeshPhysicalMaterial, MeshStandardMaterial, SRGBColorSpace, type Material } from 'three'
import type { MaterialKey } from './phoneSpec'

/** 256×512 procedural screen (no image files, ~0.5 MB GPU). Original brand placeholder content only. */
export function screenTexture(brand: string, tagline: string): CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 256; c.height = 512
  const g = c.getContext('2d')!
  const bg = g.createLinearGradient(0, 0, 256, 512)
  bg.addColorStop(0, '#2a0f66'); bg.addColorStop(0.55, '#10062c'); bg.addColorStop(1, '#05020d')
  g.fillStyle = bg; g.fillRect(0, 0, 256, 512)
  const glow = g.createRadialGradient(150, 330, 5, 150, 330, 190)
  glow.addColorStop(0, 'rgba(155,107,255,0.75)'); glow.addColorStop(1, 'rgba(155,107,255,0)')
  g.fillStyle = glow; g.fillRect(0, 0, 256, 512)
  g.fillStyle = '#f6f2ff'; g.textAlign = 'center'
  g.font = '300 64px system-ui, sans-serif'; g.fillText('9:41', 128, 130)
  g.font = '500 13px system-ui, sans-serif'; g.fillStyle = '#c9b6ff'; g.fillText('Wednesday, 18 November', 128, 158)
  g.font = '600 15px system-ui, sans-serif'; g.fillStyle = '#f6f2ff'; g.fillText(brand.toUpperCase(), 128, 450)
  g.font = '400 11px system-ui, sans-serif'; g.fillStyle = '#a99dc9'; g.fillText(tagline, 128, 470)
  g.fillStyle = '#05020d'; g.beginPath(); g.arc(128, 22, 6, 0, Math.PI * 2); g.fill()
  const t = new CanvasTexture(c)
  t.colorSpace = SRGBColorSpace
  t.anisotropy = 4
  return t
}

/** Every call returns a NEW material so each component can be highlighted or faded on its own. */
export function makeMaterial(key: MaterialKey, screen?: CanvasTexture): Material {
  switch (key) {
    case 'titanium': return new MeshStandardMaterial({ color: '#b3a8d2', metalness: 1, roughness: 0.28, envMapIntensity: 1.5 })
    case 'glass': return new MeshPhysicalMaterial({ color: '#150b2a', metalness: 0.1, roughness: 0.05, clearcoat: 1, clearcoatRoughness: 0.04, transparent: true, opacity: 0.22, depthWrite: false })
    case 'display': return new MeshStandardMaterial({ color: '#05030a', metalness: 0.4, roughness: 0.4, emissive: new Color('#ffffff'), emissiveMap: screen ?? null, emissiveIntensity: 0.9 })
    case 'rear': return new MeshPhysicalMaterial({ color: '#5430b8', metalness: 0.45, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 1.5, emissive: new Color('#2a1260'), emissiveIntensity: 0.35 })
    case 'cameraPlate': return new MeshStandardMaterial({ color: '#17121f', metalness: 0.6, roughness: 0.5 })
    case 'lens': return new MeshPhysicalMaterial({ color: '#101f52', metalness: 0.6, roughness: 0.05, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 2.4, emissive: new Color('#2a3f9a'), emissiveIntensity: 0.35 })
    case 'board': return new MeshStandardMaterial({ color: '#33207a', metalness: 0.5, roughness: 0.45 })
    case 'chip': return new MeshStandardMaterial({ color: '#2c2a38', metalness: 0.8, roughness: 0.3, emissive: new Color('#7a3cff'), emissiveIntensity: 0.12 })
    case 'copper': return new MeshStandardMaterial({ color: '#c58a5c', metalness: 1, roughness: 0.28, envMapIntensity: 1.2 })
    case 'battery': return new MeshStandardMaterial({ color: '#434d82', metalness: 0.35, roughness: 0.5 })
    case 'shield': return new MeshStandardMaterial({ color: '#8b90aa', metalness: 1, roughness: 0.42 })
    case 'flex': return new MeshStandardMaterial({ color: '#d9822b', metalness: 0.2, roughness: 0.55, side: 2 })
    case 'pen': return new MeshStandardMaterial({ color: '#6a3fff', metalness: 0.9, roughness: 0.25 })
  }
}
