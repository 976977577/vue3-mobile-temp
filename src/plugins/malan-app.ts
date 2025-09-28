import type { App } from 'vue'
import { MalanAppBridge } from '@/utils/malan-app-bridge'
import type { MalanAppConfig } from '@/utils/malan-app-bridge'

declare module 'vue' {
  interface ComponentCustomProperties {
    $malanApp: MalanAppBridge
  }
}

declare global {
  interface Window {
    malanApp: MalanAppBridge
  }
}

export interface MalanAppPluginOptions extends MalanAppConfig {
  globalProperty?: boolean
  windowProperty?: boolean
}

export default {
  install(app: App, options: MalanAppPluginOptions = {}) {
    const {
      globalProperty = true,
      windowProperty = true,
      ...bridgeConfig
    } = options

    const malanApp = new MalanAppBridge({
      autoDetect: true,
      debug: import.meta.env.DEV,
      ...bridgeConfig
    })

    if (globalProperty) {
      app.config.globalProperties.$malanApp = malanApp
    }

    if (windowProperty && typeof window !== 'undefined') {
      Object.defineProperty(window, 'malanApp', {
        value: malanApp,
        writable: false,
        configurable: false,
        enumerable: true
      })
    }

    app.provide('malanApp', malanApp)

    const originalUnmount = app.unmount
    app.unmount = function () {
      malanApp.destroy()
      originalUnmount.call(this)
    }
  }
}
