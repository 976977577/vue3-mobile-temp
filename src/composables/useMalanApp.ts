import { inject } from 'vue'
import type { MalanAppBridge } from '@/utils/malan-app-bridge'

export function useMalanApp(): MalanAppBridge {
  const malanApp = inject<MalanAppBridge>('malanApp')

  if (!malanApp) {
    throw new Error('MalanApp plugin is not installed. Please install it in main.ts')
  }

  return malanApp
}

export function getMalanApp(): MalanAppBridge | undefined {
  return typeof window !== 'undefined' ? window.malanApp : undefined
}
