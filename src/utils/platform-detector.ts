/**
 * 平台检测工具类
 * 用于检测当前运行环境的平台类型
 */

export class PlatformDetector {
  private static getUserAgent(): string {
    return typeof navigator !== 'undefined' ? navigator.userAgent : ''
  }

  static isIos(): boolean {
    const ua = PlatformDetector.getUserAgent()
    if (!ua)
      return false
    return !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  }

  static isAndroid(): boolean {
    const ua = PlatformDetector.getUserAgent()
    if (!ua)
      return false
    return !!ua.match(/(Android);?[\s/]+([\d.]+)?/)
  }

  static isApp(): boolean {
    const isAndroid = PlatformDetector.isAndroid()
    const isIos = PlatformDetector.isIos()
    return (isAndroid && (window as any).fromAndroid) || (isIos && (window as any).webkit)
  }

  static isWeixin(): boolean {
    const ua = PlatformDetector.getUserAgent()
    if (!ua)
      return false
    return /MicroMessenger/i.test(ua)
  }

  static isWeixinWork(): boolean {
    const ua = PlatformDetector.getUserAgent()
    if (!ua)
      return false
    return /wxwork/i.test(ua)
  }

  static isMobile(): boolean {
    return PlatformDetector.isIos() || PlatformDetector.isAndroid()
  }

  static isDesktop(): boolean {
    return !PlatformDetector.isMobile()
  }

  static getPlatform(): 'ios' | 'android' | 'desktop' {
    if (PlatformDetector.isIos())
      return 'ios'
    if (PlatformDetector.isAndroid())
      return 'android'
    return 'desktop'
  }

  static getPlatformInfo() {
    return {
      isIos: PlatformDetector.isIos(),
      isAndroid: PlatformDetector.isAndroid(),
      isApp: PlatformDetector.isApp(),
      isWeixin: PlatformDetector.isWeixin(),
      isWeixinWork: PlatformDetector.isWeixinWork(),
      isMobile: PlatformDetector.isMobile(),
      isDesktop: PlatformDetector.isDesktop(),
      platform: PlatformDetector.getPlatform(),
      userAgent: PlatformDetector.getUserAgent()
    }
  }
}

export const isIos = () => PlatformDetector.isIos()
export const isAndroid = () => PlatformDetector.isAndroid()
export const isApp = () => PlatformDetector.isApp()
export const isWeixin = () => PlatformDetector.isWeixin()
export const isWeixinWork = () => PlatformDetector.isWeixinWork()
export const isMobile = () => PlatformDetector.isMobile()
export const isDesktop = () => PlatformDetector.isDesktop()
export const getPlatform = () => PlatformDetector.getPlatform()
export const getPlatformInfo = () => PlatformDetector.getPlatformInfo()

export default PlatformDetector
