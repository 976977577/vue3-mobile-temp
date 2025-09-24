<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function onBack() {
  if (window.history.state.back)
    history.back()
  else
    router.replace('/')
}
</script>

<template>
  <div text="center gray-300">
    <van-icon name="warn-o" size="3em" />
    <div> Not found </div>

    <div class="mt-10">
      <button van-haptics-feedback class="btn" @click="onBack">
        Back
      </button>
    </div>
  </div>
</template>
