import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import type { EnhancedRouteLocation } from './types'
import { useRouteCacheStore, useUserStore } from '@/stores'

import { isLogin } from '@/utils/auth'
import setPageTitle from '@/utils/set-page-title'

// 路由配置
const routes: RouteRecordRaw[] = [
  // 所有基础页面已删除，路由配置已清空
  // 可以在这里添加新的路由配置
]

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_PUBLIC_PATH),
  routes,
})

router.beforeEach(async (to: EnhancedRouteLocation) => {
  const routeCacheStore = useRouteCacheStore()
  const userStore = useUserStore()

  // Route cache
  routeCacheStore.addRoute(to)

  // Set page title
  setPageTitle(to.name as string)

  if (isLogin() && !userStore.userInfo?.uid)
    await userStore.info()
})

router.afterEach(() => {
  // 路由切换完成
})

export default router
