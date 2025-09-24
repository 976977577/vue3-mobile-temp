<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { rootRouteList } from '@/config/routes'

const route = useRoute()
const router = useRouter()

/**
 * 获取页面标题
 */
const title = computed(() => {
  const pageNames: Record<string, string> = {
    Home: '首页',
    Login: '登录',
    Register: '注册',
    NotFound: '404',
  }

  if (route.name && typeof route.name === 'string') {
    return pageNames[route.name] || route.name
  }

  return '未定义'
})

/**
 * Show the left arrow
 * If route name is in rootRouteList, hide left arrow
 */
const showLeftArrow = computed(() => {
  if (route.name && rootRouteList.includes(route.name as string)) {
    return false
  }

  return true
})

function onBack() {
  if (window.history.state.back) {
    history.back()
  }
  else {
    router.replace('/')
  }
}
</script>

<template>
  <VanNavBar
    :title="title"
    :fixed="true"
    :left-arrow="showLeftArrow"
    placeholder clickable
    @click-left="onBack"
  />
</template>
