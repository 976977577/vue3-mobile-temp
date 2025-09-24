<script setup lang="ts">
const menuItems = [
  { title: '登录', route: 'login' },
  { title: '注册', route: 'register' },
  { title: '404页面', route: 'unknown' },
]
</script>

<template>
  <van-cell-group title="示例页面" :border="false" :inset="true">
    <template v-for="item in menuItems" :key="item.route">
      <van-cell :title="item.title" :to="item.route" is-link />
    </template>
  </van-cell-group>
</template>
