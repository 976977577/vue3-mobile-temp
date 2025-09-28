import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useMalanApp } from '@/composables/useMalanApp'

export interface AppInfo {
  version: string // 应用版本
  versionCode: string // 版本代码
  isDebug: string // 是否调试模式
  client: string // 客户端标识
  phoneModel: string // 手机型号
  deviceId: string // 设备ID
}

const defaultAppInfo: AppInfo = {
  version: '',
  versionCode: '',
  isDebug: '',
  client: '',
  phoneModel: '',
  deviceId: ''
}

const useAppStore = defineStore(
  'app',
  () => {
    const malanApp = useMalanApp()
    const appInfo = ref<AppInfo>({ ...defaultAppInfo })

    const setAppInfo = (info: Partial<AppInfo>) => {
      appInfo.value = { ...appInfo.value, ...info }
    }

    const clearAppInfo = () => {
      appInfo.value = { ...defaultAppInfo }
    }

    const initAppInfo = async (): Promise<AppInfo> => {
      try {
        const result = await malanApp.callMethod('getAppInfo')
        if (result.success && result.data) {
          setAppInfo(result.data)
          return appInfo.value
        }
        else {
          throw new Error(result.error || '初始化 App 信息失败')
        }
      }
      catch (error) {
        throw new Error(`初始化 App 信息失败: ${error}`)
      }
    }

    return {
      appInfo,
      setAppInfo,
      clearAppInfo,
      initAppInfo
    }
  },
  {
    persist: true
  }
)

export default useAppStore
