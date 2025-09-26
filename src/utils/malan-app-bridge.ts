import { isAndroid, isIos } from './platform-detector'

const APP_EVENT_NAMES = [
  'enterDeActivated',
  'enterActivated',
  'onPageShow',
  'shareSuccess',
  'onWxOpenId',
] as const

const PLATFORM_TYPE = {
  IOS: 'ios',
  ANDROID: 'android',
  UNKNOWN: 'unknown',
} as const

type PlatformType = (typeof PLATFORM_TYPE)[keyof typeof PLATFORM_TYPE]

// 定义具体的回调函数类型
type EventCallback = () => void
type MethodCallback = (result: any, error?: string) => void
type AndroidCallback = (result: any) => void
type BridgeCallback = (bridge: IOSBridge) => void

interface IOSBridge {
  callHandler: (method: string, data: any, callback: (result: any) => void) => void
  registerHandler: (method: string, callback: (data?: any) => void) => void
}

type ExtendedWindow = Window & {
  fromWeb: Record<string, EventCallback>
  fromAndroid: Record<string, (data?: string) => any>
  androidCallback: AndroidCallback
  WKWebViewJavascriptBridge?: IOSBridge
  WKWVJBCallbacks?: BridgeCallback[]
  webkit?: {
    messageHandlers: {
      iOS_Native_InjectJavascript: {
        postMessage: (message: any) => void
      }
    }
  }
}

interface MethodConfig {
  name: string
  hasCallback?: boolean
  androidMethod?: string
}

interface MalanAppConfig {
  methods?: MethodConfig[]
  debug?: boolean
  autoDetect?: boolean
}

interface CallResult {
  success: boolean
  error?: string
  data?: any
}

type AppEventName = (typeof APP_EVENT_NAMES)[number]

class MalanAppBridge {
  private eventMap: Record<string, Set<EventCallback>> = {}
  private methodConfigs: Map<string, MethodConfig> = new Map()
  private config: MalanAppConfig
  private debug: boolean = false
  private platformType: PlatformType

  constructor(config: MalanAppConfig = {}) {
    this.config = { autoDetect: true, ...config }
    this.debug = config.debug || false
    this.platformType = this.detectPlatform()
    this.init()
  }

  private detectPlatform(): PlatformType {
    if (isIos())
      return PLATFORM_TYPE.IOS
    if (isAndroid())
      return PLATFORM_TYPE.ANDROID
    return PLATFORM_TYPE.UNKNOWN
  }

  private log(message: string, ...args: any[]): void {
    if (!this.debug)
      return
    console.log(`[MalanApp] ${message}`, ...args)
  }

  private logError(message: string, error?: any): void {
    console.error(`[MalanApp] ${message}`, error)
  }

  private setupWKWebViewJavascriptBridge(callback: BridgeCallback): void {
    const win = window as unknown as ExtendedWindow

    if (win.WKWebViewJavascriptBridge) {
      return callback(win.WKWebViewJavascriptBridge)
    }

    if (win.WKWVJBCallbacks) {
      win.WKWVJBCallbacks.push(callback)
      return
    }

    win.WKWVJBCallbacks = [callback]
    win.webkit?.messageHandlers.iOS_Native_InjectJavascript.postMessage(null)
  }

  private createPromiseWithCallback(
    executor: (resolve: (value: CallResult) => void, callback?: MethodCallback) => void,
    callback?: MethodCallback,
  ): Promise<CallResult> {
    return new Promise((resolve) => {
      executor(resolve, callback)
    })
  }

  private init(): void {
    this.initGlobalObjects()
    this.initEvents()

    if (this.config.autoDetect) {
      this.autoDetectMethods()
    }

    if (!this.config.methods)
      return

    this.config.methods.forEach((method) => {
      this.methodConfigs.set(method.name, method)
    })
  }

  private initGlobalObjects(): void {
    if (typeof window === 'undefined')
      return

    const win = window as unknown as ExtendedWindow
    win.fromWeb = win.fromWeb || {}
    win.androidCallback = win.androidCallback || (() => {})
  }

  private initEvents(): void {
    APP_EVENT_NAMES.forEach((eventName) => {
      if (typeof window === 'undefined')
        return

      const win = window as unknown as ExtendedWindow
      win.fromWeb[eventName] = () => {
        const callbacks = this.eventMap[eventName]
        if (!callbacks || callbacks.size === 0)
          return

        callbacks.forEach((callback) => {
          try {
            callback()
          }
          catch (error) {
            this.logError(`Event callback error for ${eventName}:`, error)
          }
        })
      }
    })
  }

  private autoDetectMethods(): void {
    if (this.platformType !== PLATFORM_TYPE.ANDROID)
      return

    this.registerAndroidMethods()
  }

  private registerAndroidMethods(): void {
    const win = window as unknown as ExtendedWindow
    const androidObj = win.fromAndroid
    if (!androidObj)
      return

    for (const methodName in androidObj) {
      if (typeof androidObj[methodName] !== 'function')
        continue

      this.registerAndroidMethod(methodName)
    }
  }

  private registerAndroidMethod(methodName: string): void {
    const config: MethodConfig = {
      name: methodName,
      hasCallback: false,
      androidMethod: methodName,
    }

    this.methodConfigs.set(methodName, config)
    this.log(`检测到方法: ${methodName}`)
  }

  on(eventName: AppEventName, callback: EventCallback): void {
    if (!this.eventMap[eventName]) {
      this.eventMap[eventName] = new Set()
    }
    this.eventMap[eventName].add(callback)
  }

  off(eventName: AppEventName, callback?: EventCallback): void {
    const callbacks = this.eventMap[eventName]
    if (!callbacks)
      return

    if (!callback) {
      callbacks.clear()
      return
    }

    callbacks.delete(callback)
  }

  registerMethod(config: MethodConfig): void {
    this.methodConfigs.set(config.name, config)
  }

  registerMethods(configs: MethodConfig[]): void {
    configs.forEach(config => this.registerMethod(config))
  }

  async callMethod(methodName: string, data?: any, callback?: MethodCallback): Promise<CallResult> {
    let config = this.methodConfigs.get(methodName)

    if (!config && this.config.autoDetect) {
      await this.tryRegisterMethod(methodName)
      config = this.methodConfigs.get(methodName)
    }

    if (!config) {
      const error = `Method ${methodName} not found`
      callback?.(null, error)
      return { success: false, error }
    }

    return this.executeMethod(config, data, callback)
  }

  callHandler = this.callMethod

  private async tryRegisterMethod(methodName: string): Promise<void> {
    if (this.platformType !== PLATFORM_TYPE.ANDROID)
      return

    const win = window as unknown as ExtendedWindow
    const androidObj = win.fromAndroid
    if (!androidObj?.[methodName] || typeof androidObj[methodName] !== 'function')
      return

    this.registerAndroidMethod(methodName)
    this.log(`动态注册: ${methodName}`)
  }

  private async executeMethod(
    config: MethodConfig,
    data?: any,
    callback?: MethodCallback,
  ): Promise<CallResult> {
    switch (this.platformType) {
      case PLATFORM_TYPE.IOS: {
        return this.callIosMethod(config, data, callback)
      }
      case PLATFORM_TYPE.ANDROID: {
        return this.callAndroidMethod(config, data, callback)
      }
      default: {
        const error = 'Not in app environment'
        callback?.(null, error)
        return { success: false, error }
      }
    }
  }

  private async callIosMethod(
    config: MethodConfig,
    data?: any,
    callback?: MethodCallback,
  ): Promise<CallResult> {
    return this.createPromiseWithCallback((resolve, cb) => {
      this.setupWKWebViewJavascriptBridge((bridge) => {
        try {
          bridge.callHandler(config.name, data, (result: any) => {
            cb?.(result)
            callback?.(result)
            resolve({ success: true, data: result })
          })
        }
        catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error)
          this.logError(`iOS 调用失败: ${config.name}`, error)
          cb?.(null)
          callback?.(null)
          resolve({ success: false, error: errorMsg })
        }
      })
    }, callback)
  }

  private async callAndroidMethod(
    config: MethodConfig,
    data?: any,
    callback?: MethodCallback,
  ): Promise<CallResult> {
    return this.createPromiseWithCallback((resolve) => {
      const handleError = (error: string) => {
        callback?.(null, error)
        resolve({ success: false, error })
      }

      try {
        const win = window as unknown as ExtendedWindow
        const androidObj = win.fromAndroid
        if (!androidObj) {
          return handleError('Android bridge not available')
        }

        const actualMethodName = config.androidMethod || config.name
        const androidMethod = androidObj[actualMethodName]

        if (!androidMethod || typeof androidMethod !== 'function') {
          return handleError(`Android method ${actualMethodName} not found`)
        }

        const jsonData = data ? JSON.stringify(data) : null

        if (config.hasCallback && callback) {
          win.androidCallback = (result: any) => {
            callback(result)
            resolve({ success: true, data: result })
          }
          androidMethod(jsonData)
          return
        }

        const result = androidMethod(jsonData)
        callback?.(result)
        resolve({ success: true, data: result })
      }
      catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        this.logError(`Android 调用失败: ${config.name}`, error)
        handleError(errorMsg)
      }
    }, callback)
  }

  registerHandler(eventName: string, callback: (data?: any) => void): void {
    if (this.platformType !== PLATFORM_TYPE.IOS) {
      console.warn('registerHandler is only supported on iOS')
      return
    }

    this.setupWKWebViewJavascriptBridge((bridge) => {
      bridge.registerHandler(eventName, callback)
    })
  }

  getRegisteredMethods(): string[] {
    return Array.from(this.methodConfigs.keys())
  }

  hasMethod(methodName: string): boolean {
    return this.methodConfigs.has(methodName)
  }

  getPlatformType(): PlatformType {
    return this.platformType
  }

  destroy(): void {
    Object.values(this.eventMap).forEach(callbacks => callbacks.clear())
    this.eventMap = {}
    this.methodConfigs.clear()
  }
}

// 默认实例（开箱即用）
const malanApp = new MalanAppBridge({ autoDetect: true })

export default malanApp
export { MalanAppBridge, PLATFORM_TYPE }
export type { MethodConfig, CallResult, MalanAppConfig, AppEventName, PlatformType }
