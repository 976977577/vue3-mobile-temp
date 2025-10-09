export const inBrowser
  = typeof window !== 'undefined' && typeof document !== 'undefined'

export function raf(callback: () => void): number {
  return requestAnimationFrame(callback)
}

export function cancelRaf(id: number): void {
  cancelAnimationFrame(id)
}
