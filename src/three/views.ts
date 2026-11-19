export type ViewId = 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom' | 'iso'
export const VIEWS: ReadonlyArray<{ id: ViewId; label: string; phi: number; theta: number }> = [
  { id: 'front', label: 'Front', phi: Math.PI / 2, theta: 0 },
  { id: 'back', label: 'Back', phi: Math.PI / 2, theta: Math.PI },
  { id: 'left', label: 'Left', phi: Math.PI / 2, theta: -Math.PI / 2 },
  { id: 'right', label: 'Right', phi: Math.PI / 2, theta: Math.PI / 2 },
  { id: 'top', label: 'Top', phi: 0.02, theta: 0 },
  { id: 'bottom', label: 'Bottom', phi: Math.PI - 0.02, theta: 0 },
  { id: 'iso', label: '3/4', phi: 1.2, theta: -0.75 },
]
