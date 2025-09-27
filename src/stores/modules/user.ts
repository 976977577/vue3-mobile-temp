import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LoginData, RegisterData, UserState } from '@/api/user'
import { clearToken, setToken } from '@/utils/auth'

import {
  getUserInfo,
  login as userLogin,
  logout as userLogout,
  register as userRegister
} from '@/api/user'

const InitUserInfo = {
  uid: 0,
  nickname: '',
  avatar: ''
}

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserState>({ ...InitUserInfo })

  // Set user's information
  const setInfo = (partial: Partial<UserState>) => {
    userInfo.value = { ...partial }
  }

  const login = async (loginForm: LoginData) => {
    try {
      const { data } = await userLogin(loginForm)
      setToken(data.token)
    }
    catch (error) {
      clearToken()
      throw error
    }
  }

  const info = async () => {
    try {
      const { data } = await getUserInfo()
      setInfo(data)
    }
    catch (error) {
      clearToken()
      throw error
    }
  }

  const logout = async () => {
    try {
      await userLogout()
    }
    finally {
      clearToken()
      setInfo({ ...InitUserInfo })
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const result = await userRegister(data)
      return result
    }
    catch {}
  }

  return {
    userInfo,
    info,
    login,
    logout,
    register
  }
}, {
  persist: true
})

export default useUserStore
