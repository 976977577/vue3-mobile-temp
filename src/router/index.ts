import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import type { EnhancedRouteLocation } from './types'
import { useRouteCacheStore } from '@/stores'

import setPageTitle from '@/utils/set-page-title'

// 路由配置
const routes: RouteRecordRaw[] = [
  // 商家评价管理相关路由
  {
    path: '/merchant/reviews',
    name: 'CustomerReviews',
    component: () => import('@/pages/merchant/CustomerReviews.vue'),
    meta: {
      title: '顾客评价列表',
      keepAlive: true
    }
  },
  {
    path: '/merchant/review/:id',
    name: 'ReviewDetail',
    component: () => import('@/pages/merchant/ReviewDetail.vue'),
    meta: {
      title: '评价详情',
      keepAlive: false
    }
  },
  {
    path: '/merchant/reply-review/:id',
    name: 'ReplyReview',
    component: () => import('@/pages/merchant/ReplyReview.vue'),
    meta: {
      title: '回复评价',
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
