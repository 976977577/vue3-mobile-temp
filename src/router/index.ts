import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import type { EnhancedRouteLocation } from './types'
import { useRouteCacheStore } from '@/stores'

import setPageTitle from '@/utils/set-page-title'

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'FontDemo',
    component: () => import('@/pages/FontDemo.vue'),
    meta: {
      title: '字体切片演示',
      keepAlive: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue'),
    meta: {
      title: '页面未找到',
      keepAlive: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_PUBLIC_PATH),
  routes
})

router.beforeEach(async (to: EnhancedRouteLocation) => {
  const routeCacheStore = useRouteCacheStore()

  // Route cache
  routeCacheStore.addRoute(to)

  // Set page title
  setPageTitle(to.name as string)
})

router.afterEach(() => {
  // 路由切换完成
})

export default router
