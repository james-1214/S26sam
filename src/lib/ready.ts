/** Resolves when the first 3D stage has built its model and camera (the loader waits for it, with a timeout). */
let resolveReady: () => void = () => undefined
export const modelReady: Promise<void> = new Promise((r) => { resolveReady = r })
export const markModelReady = (): void => resolveReady()
