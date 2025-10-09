<script setup lang="ts">
const { size = 18 } = defineProps<{
  averageRating: number
  size?: number
}>()
</script>

<template>
  <van-rate
    :model-value="averageRating"
    readonly
    :size="size"
    icon="https://cdn.mlhk.com/H5/image/icon/4de99dc8-e896-4f6e-927a-07aec616d41f.svg"
    void-icon="https://cdn.mlhk.com/H5/image/icon/4a08f6f2-21ce-4cd8-b090-afb5f48e8d15.svg"
    color="#f98633"
    void-color="#b7b7b7"
  />
</template>
