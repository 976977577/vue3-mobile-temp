import { isAndroid, isIos } from './platform-detector'

const APP_EVENT_NAMES = [
  'enterDeActivated',
  'enterActivated',
  'onPageShow',
  'shareSuccess',
  'onWxOpenId'
] as const

const PLATFORM_TYPE = {
  IOS: 'ios',
  ANDROID: 'android',
  UNKNOWN: 'unknown'
} as const

type PlatformType = (typeof PLATFORM_TYPE)[keyof typeof PLATFORM_TYPE]

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
  isSync?: boolean
  nativeMethod?: string
}

interface MalanAppConfig {
  methods?: MethodConfig[]
  debug?: boolean
  autoDetect?: boolean
  queueTimeout?: number
}

interface MethodResult {
  success: boolean
  error?: string
  data?: any
}

interface CallOptions {
  isSync?: boolean
}

interface QueueItem {
  id: string
  methodName: string
  config: MethodConfig
  data?: any
  callback?: MethodCallback
  resolve: (value: MethodResult) => void
  timestamp: number
}

interface CallbackInfo {
  callback?: MethodCallback
  resolve: (value: MethodResult) => void
  timestamp: number
}

type AppEventName = (typeof APP_EVENT_NAMES)[number]

class MalanAppBridge {
  private eventMap: Record<string, Set<EventCallback>> = {}
  private methodConfigs: Map<string, MethodConfig> = new Map()
  private config: MalanAppConfig
  private debug: boolean = false
  private platformType: PlatformType

  private callQueue: QueueItem[] = []
  private callbackMap: Map<string, CallbackInfo> = new Map()
  private isProcessing: boolean = false
  private callIdCounter: number = 0
  private queueTimeout: number = 60000

  constructor(config: MalanAppConfig = {}) {
    this.config = { autoDetect: true, ...config }
    this.debug = config.debug || false
    this.queueTimeout = config.queueTimeout || 60000
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
    console.log(`[MalanApp] 😄 ${message}`, ...args)
  }

  private logError(message: string, error?: any): void {
    console.error(`[MalanApp] 😭 ${message}`, error)
  }

  private generateCallId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID()
    }
    return `call_${++this.callIdCounter}_${Date.now()}`
  }

  // 清理超时的回调
  private cleanupTimeoutCallbacks(): void {
    const now = Date.now()

    Array.from(this.callbackMap.entries())
      .filter(([, info]) => now - info.timestamp > this.queueTimeout)
      .forEach(([callId, info]) => {
        info.callback?.(null, 'Call timeout')
        info.resolve({ success: false, error: 'Call timeout' })
        this.callbackMap.delete(callId)
      })
  }

  private async processNextInQueue(): Promise<void> {
    if (this.isProcessing || this.callQueue.length === 0) {
      return
    }

    this.isProcessing = true

    try {
      // 清理超时的回调
      this.cleanupTimeoutCallbacks()

      const queueItem = this.callQueue.shift()
      if (!queueItem) {
        this.isProcessing = false
        return
      }

      await this.executeMethodDirectly(queueItem)
    }
    catch (error) {
      this.logError('队列处理错误:', error)
    }
    finally {
      this.isProcessing = false
      queueMicrotask(() => this.processNextInQueue())
    }
  }

  private async executeMethodDirectly(queueItem: QueueItem): Promise<void> {
    const { id, config, data, callback, resolve } = queueItem

    if (callback || !config.isSync) {
      this.callbackMap.set(id, {
        callback,
        resolve,
        timestamp: Date.now()
      })
    }

    try {
      switch (this.platformType) {
        case PLATFORM_TYPE.IOS: {
          await this.callIosMethodDirectly(id, config, data)
          break
        }
        case PLATFORM_TYPE.ANDROID: {
          await this.callAndroidMethodDirectly(id, config, data)
          break
        }
        default: {
          const error = 'Not in app environment'
          callback?.(null, error)
          resolve({ success: false, error })
          this.callbackMap.delete(id)
        }
      }
    }
    catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      this.logError(`方法调用失败: ${config.name}`, error)
      callback?.(null, errorMsg)
      resolve({ success: false, error: errorMsg })
      this.callbackMap.delete(id)
    }
  }

  private async callIosMethodDirectly(
    callId: string,
    config: MethodConfig,
    data?: any
  ): Promise<void> {
    this.setupWKWebViewJavascriptBridge((bridge) => {
      try {
        if (config.isSync) {
          const result = bridge.callHandler(config.name, data, () => {})
          this.handleMethodResult(callId, result)
        }
        else {
          bridge.callHandler(config.name, data, (result: any) => {
            this.handleMethodResult(callId, result)
          })
        }
      }
      catch (error) {
        this.handleMethodError(callId, error)
      }
    })
  }

  private async callAndroidMethodDirectly(
    callId: string,
    config: MethodConfig,
    data?: any
  ): Promise<void> {
    const win = window as unknown as ExtendedWindow
    const androidObj = win.fromAndroid

    if (!androidObj) {
      this.handleMethodError(callId, 'Android bridge not available')
      return
    }

    const actualMethodName = config.nativeMethod || config.name

    if (!androidObj[actualMethodName] || typeof androidObj[actualMethodName] !== 'function') {
      this.handleMethodError(callId, `Android method ${actualMethodName} not found`)
      return
    }

    const hasPayload = data !== undefined && data !== null
    const jsonData = hasPayload ? JSON.stringify(data) : undefined

    if (config.isSync) {
      try {
        const result = hasPayload ? androidObj[actualMethodName](jsonData) : androidObj[actualMethodName]()
        this.handleMethodResult(callId, result)
      }
      catch (error) {
        this.handleMethodError(callId, error)
      }
      return
    }

    win.androidCallback = (result: any) => {
      this.handleMethodResult(callId, result)
      win.androidCallback = () => {}
    }

    try {
      if (hasPayload) {
        androidObj[actualMethodName](jsonData)
      }
      else {
        androidObj[actualMethodName]()
      }
    }
    catch (error) {
      this.handleMethodError(callId, error)
      win.androidCallback = () => {} // 清理回调
    }
  }

  // 处理方法调用结果
  private handleMethodResult(callId: string, result: any): void {
    const callbackInfo = this.callbackMap.get(callId)
    if (!callbackInfo)
      return

    let parsedResult = result
    if (typeof result === 'string' && result.length >= 2) {
      try {
        const parsed = JSON.parse(parsedResult)
        if (parsed !== null && typeof parsed === 'object') {
          parsedResult = parsed
        }
      }
      catch {}
    }
    callbackInfo.callback?.(parsedResult)
    callbackInfo.resolve({ success: true, data: parsedResult })
    this.callbackMap.delete(callId)
  }

  // 处理方法调用错误
  private handleMethodError(callId: string, error: any): void {
    const callbackInfo = this.callbackMap.get(callId)
    if (!callbackInfo) {
      return
    }

    const errorMsg = error instanceof Error ? error.message : String(error)

    callbackInfo.callback?.(null, errorMsg)
    callbackInfo.resolve({ success: false, error: errorMsg })
    this.callbackMap.delete(callId)
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

  private init(): void {
    this.initGlobalObjects()
    this.initEvents()

    // 自动检测并注册方法(安卓生效)
    if (this.config.autoDetect) {
      this.registerMethods()
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

  private registerMethods(): void {
    const win = window as unknown as ExtendedWindow
    const androidObj = win.fromAndroid
    if (!androidObj)
      return

    const methodNames = Object.keys(androidObj).filter(
      name => typeof androidObj[name] === 'function'
    )

    if (!methodNames.length)
      return

    methodNames.forEach(name => this.registerMethod(name))
    this.log('检测到 Android 方法', methodNames.length, '个:', methodNames)
  }

  private registerMethod(methodName: string): void {
    const config: MethodConfig = {
      name: methodName,
      isSync: false,
      nativeMethod: methodName
    }

    this.methodConfigs.set(methodName, config)
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

  private isCallOptions(val: unknown): val is CallOptions {
    return typeof val === 'object' && val !== null && 'isSync' in val
  }

  callMethod(methodName: string): Promise<MethodResult>
  callMethod<T>(methodName: string, data: T): Promise<MethodResult>
  callMethod(methodName: string, callback: MethodCallback): Promise<MethodResult>
  callMethod(methodName: string, options: CallOptions): Promise<MethodResult>
  callMethod<T>(methodName: string, data: T, callback: MethodCallback): Promise<MethodResult>
  callMethod<T>(methodName: string, data: T, options: CallOptions): Promise<MethodResult>
  callMethod(methodName: string, callback: MethodCallback, options: CallOptions): Promise<MethodResult>
  callMethod<T>(
    methodName: string,
    data: T,
    callback: MethodCallback,
    options: CallOptions
  ): Promise<MethodResult>
  async callMethod(
    methodName: string,
    dataOrCallbackOrOptions?: any | MethodCallback | CallOptions,
    callbackOrOptions?: MethodCallback | CallOptions,
    options?: CallOptions
  ): Promise<MethodResult> {
    let data: any
    let callback: MethodCallback | undefined
    let finalOptions: CallOptions | undefined

    const args = [dataOrCallbackOrOptions, callbackOrOptions, options].filter(
      arg => arg !== undefined
    )

    for (const arg of args) {
      if (typeof arg === 'function') {
        callback = arg
      }
      else if (this.isCallOptions(arg)) {
        finalOptions = arg
      }
      else {
        data = arg
      }
    }

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

    if (finalOptions?.isSync !== undefined) {
      config = { ...config, isSync: finalOptions.isSync }
    }
    return this.executeMethodWithQueue(methodName, config, data, callback)
  }

  private executeMethodWithQueue(
    methodName: string,
    config: MethodConfig,
    data?: any,
    callback?: MethodCallback
  ): Promise<MethodResult> {
    return new Promise((resolve) => {
      const callId = this.generateCallId()

      const queueItem: QueueItem = {
        id: callId,
        methodName,
        config,
        data,
        callback,
        resolve,
        timestamp: Date.now()
      }

      this.callQueue.push(queueItem)

      this.processNextInQueue()
    })
  }

  callHandler = this.callMethod

  private async tryRegisterMethod(methodName: string): Promise<void> {
    if (this.platformType === PLATFORM_TYPE.ANDROID) {
      const win = window as unknown as ExtendedWindow
      const androidObj = win.fromAndroid
      if (!androidObj?.[methodName] || typeof androidObj[methodName] !== 'function')
        return
      this.log(`✅ 动态注册 Android 方法: ${methodName}`)
      this.registerMethod(methodName)
    }
    else if (this.platformType === PLATFORM_TYPE.IOS) {
      /**
       * iOS 平台无法像 Android 那样通过 window.fromAndroid 预先验证方法是否存在
       * WKWebViewJavascriptBridge 基于消息通道，只能在调用时才知道方法是否可用
       * 如果原生方法不存在，h5调用会一直不响应直到自动超时，而不是立即返回错误
       */
      this.log(
        `✅ 动态注册 iOS 方法: "${methodName}"`
      )
      this.registerMethod(methodName)
    }
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

  clearQueue(): void {
    this.callQueue.forEach((item) => {
      item.callback?.(null, 'Queue cleared')
      item.resolve({ success: false, error: 'Queue cleared' })
    })

    this.callbackMap.forEach((info) => {
      info.callback?.(null, 'Queue cleared')
      info.resolve({ success: false, error: 'Queue cleared' })
    })

    this.callQueue = []
    this.callbackMap.clear()
    this.isProcessing = false

    this.log('队列已清空')
  }

  destroy(): void {
    this.clearQueue()

    Object.values(this.eventMap).forEach(callbacks => callbacks.clear())
    this.eventMap = {}
    this.methodConfigs.clear()
  }
}
export default MalanAppBridge
export { MalanAppBridge, PLATFORM_TYPE }
export type { MethodConfig, MethodResult, MalanAppConfig, AppEventName, PlatformType, CallOptions }
