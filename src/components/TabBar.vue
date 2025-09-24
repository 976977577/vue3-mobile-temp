<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { rootRouteList } from '@/config/routes'

const active = ref(0)
const route = useRoute()

const show = computed(() => {
  if (route.name && rootRouteList.includes(route.name as string)) {
    return true
  }
  return false
})
</script>

<template>
  <van-tabbar v-if="show" v-model="active" route placeholder>
    <van-tabbar-item replace to="/">
      首页
      <template #icon>
        <div class="i-carbon:home" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace to="/profile">
      个人中心
      <template #icon>
        <div class="i-carbon:user" />
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>
