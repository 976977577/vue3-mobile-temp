<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import vw from '@/utils/inline-px-to-vw'
import logo from '~/images/logo.svg'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)

const postData = reactive({
  email: '',
  password: '',
})

const rules = reactive({
  email: [
    { required: true, message: '请输入邮箱' },
  ],
  password: [
    { required: true, message: '请输入密码' },
  ],
})

async function login(values: any) {
  try {
    loading.value = true
    await userStore.login({ ...postData, ...values })
    const { redirect, ...othersQuery } = router.currentRoute.value.query
    router.push({
      name: (redirect as string) || 'Home',
      query: {
        ...othersQuery,
      },
    })
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="m-x-a text-center w-7xl">
    <div class="mb-32 mt-20">
      <van-image :src="logo" class="h-120 w-120" alt="brand logo" />
    </div>

    <van-form :model="postData" :rules="rules" validate-trigger="onSubmit" @submit="login">
      <div class="rounded-3xl overflow-hidden">
        <van-field
          v-model="postData.email"
          :rules="rules.email"
          name="email"
          placeholder="邮箱"
        />
      </div>

      <div class="mt-16 rounded-3xl overflow-hidden">
        <van-field
          v-model="postData.password"
          type="password"
          :rules="rules.password"
          name="password"
          placeholder="密码"
        />
      </div>

      <div class="mt-16">
        <van-button
          :loading="loading"
          type="primary"
          native-type="submit"
          round block
        >
          登录
        </van-button>
      </div>
    </van-form>

    <GhostButton block to="register" :style="{ 'margin-top': vw(18) }">
      注册
    </GhostButton>

    <GhostButton block to="forgot-password">
      忘记密码
    </GhostButton>
  </div>
</template>
