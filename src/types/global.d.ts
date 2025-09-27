// 全局类型声明
declare global {
  interface Window {
    readonly malanApp: typeof import('@/utils/malan-app-bridge').default
  }
}

export {}
