<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '@unhead/vue'

import { useRouteCacheStore } from '@/stores'
import { appDescription, appName } from './constants'

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

const keepAliveRouteNames = computed(() => {
  return routeCacheStore.routeCaches
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
