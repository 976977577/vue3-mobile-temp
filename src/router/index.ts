import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import type { EnhancedRouteLocation } from './types'
import { useRouteCacheStore, useUserStore } from '@/stores'

import { isLogin } from '@/utils/auth'
import setPageTitle from '@/utils/set-page-title'

NProgress.configure({ showSpinner: true, parent: '#app' })

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/index.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/login/index.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/register/index.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/[...all].vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_PUBLIC_PATH),
  routes,
})

router.beforeEach(async (to: EnhancedRouteLocation) => {
  NProgress.start()

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
  NProgress.done()
})

export default router
