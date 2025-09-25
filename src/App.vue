<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '@unhead/vue'

import { useRouteCacheStore } from '@/stores'

useHead({
  title: () => 'Vue3 Vant Mobile',
  meta: [
    {
      name: 'description',
      content: () => '基于 Vue 3 生态系统的移动端 Web 应用模板',
    },
    {
      name: 'theme-color',
      content: () => '#ffffff',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: () => '/favicon.svg',
    },
  ],
})

const routeCacheStore = useRouteCacheStore()

const keepAliveRouteNames = computed(() => {
  return routeCacheStore.routeCaches
})
</script>

<template>
  <van-config-provider>
    <nav-bar />
    <router-view v-slot="{ Component }">
      <keep-alive :include="keepAliveRouteNames as string[]">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </van-config-provider>
</template>
