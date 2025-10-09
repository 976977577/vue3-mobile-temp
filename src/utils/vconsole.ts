import { useUserStore } from '@/stores'
import type { VConsoleOptions } from 'core/options.interface'
import VConsole from 'vconsole'

interface EnableVConsoleOptions {
  targetSelector?: string
  maxTime?: number
  clickThreshold?: number
  vConsoleConfig?: VConsoleOptions
  whitelist?: string[]
}

let vConsoleInstance: VConsole | null = null

export function enableVConsole(options: EnableVConsoleOptions = {}): void {
  const {
    targetSelector = 'body',
    maxTime = 5000,
    clickThreshold = 20,
    vConsoleConfig = { theme: 'dark' },
    whitelist = []
  } = options

  // 防止重复初始化
  if (vConsoleInstance)
    return

  const isProduction = import.meta.env.VITE_ENV === 'production'

  // 非生产环境直接开启
  if (!isProduction) {
    vConsoleInstance = new VConsole(vConsoleConfig)
    return
  }

  // 检查白名单
  const currentUser = useUserStore().userInfo
  if (currentUser && whitelist.length && !whitelist.includes(currentUser.phone))
    return

  // 查找目标元素
  const targetElement = document.querySelector(targetSelector)
  if (!targetElement)
    return

  let clickCount = 0
  let startTime: number | null = null

  const handleClick = (): void => {
    const now = Date.now()

    if (!startTime || now - startTime > maxTime) {
      clickCount = 0
      startTime = now
    }

    clickCount++

    if (clickCount >= clickThreshold) {
      showToast('vConsole 已开启')
      vConsoleInstance = new VConsole(vConsoleConfig)
      targetElement.removeEventListener('touchstart', handleClick)
    }
  }

  targetElement.addEventListener('touchstart', handleClick)
}
