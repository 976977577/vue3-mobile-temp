<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import { useUrlSearchParams } from '@vueuse/core'

import { useAppStore, useRouteCacheStore, useUserStore } from '@/stores'
import { appDescription, appName } from './constants'
import { getToken, setToken } from '@/utils/auth'

useHead({
  title: () => appName(),
  meta: [
    {
      name: 'description',
      content: () => appDescription()
    },
    {
      name: 'theme-color',
      content: () => '#ffffff'
    }
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: () => '/favicon.svg'
    }
  ]
})

const routeCacheStore = useRouteCacheStore()
const userStore = useUserStore()
const appStore = useAppStore()

const keepAliveRouteNames = computed(() => {
  return routeCacheStore.routeCaches
})

onMounted(async () => {
  try {
    const routeParam = useUrlSearchParams()

    const token = routeParam.token as string
    if (token) {
      setToken(token)
    }

    if (token || getToken()) {
      await userStore.refresh()
    }

    const appInfo = await appStore.initAppInfo()
    console.log('🚀 ~ appInfo:', appInfo)
    // window.malanApp.on('onPageShow', (...args: any[]) => {
    //   console.log('🚀 ~ onPageShow ~ appInfo:', args)
    // })
  }
  catch (error) {
    console.error('App mounted 钩子执行失败:', error)
  }
})
</script>

<template>
  <van-config-provider>
    <router-view v-slot="{ Component }">
      <keep-alive :include="keepAliveRouteNames as string[]">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </van-config-provider>
</template>
