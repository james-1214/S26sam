import { useMemo, useSyncExternalStore } from 'react'
import { ExplodeController } from './ExplodeController'

export const useExplodeController = (): ExplodeController => useMemo(() => new ExplodeController(), [])
export const useExplodeTarget = (c: ExplodeController): number => useSyncExternalStore(c.subscribe, () => c.target)
export const useExplodeState = (c: ExplodeController) => useSyncExternalStore(c.subscribe, () => c.state)
