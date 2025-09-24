import { appName } from '@/constants'

/**
 * 设置页面标题
 * @param name 页面名称
 */
export default (name?: string) => {
  const pageNames: Record<string, string> = {
    Home: '首页',
    Login: '登录',
    Register: '注册',
    NotFound: '404',
  }

  const pageName = name && pageNames[name] ? pageNames[name] : name
  window.document.title = pageName ? `${pageName} - ${appName()}` : appName()
}
