<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

/**
 * 获取页面标题
 */
const title = computed(() => {
  const pageNames: Record<string, string> = {
    // 可以根据新的页面添加标题映射
  }

  if (route.name && typeof route.name === 'string') {
    return pageNames[route.name] || route.name
  }

  return '未定义'
})

/**
 * 显示左箭头
 * 由于 rootRouteList 已删除，默认显示返回箭头
 */
const showLeftArrow = computed(() => {
  // 可以根据需要自定义显示逻辑
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
