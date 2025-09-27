import { STORAGE_TOKEN_KEY } from '@/stores/mutation-type'
import { useLocalStorage } from '@vueuse/core'

const token = useLocalStorage(STORAGE_TOKEN_KEY, '')

function isLogin() {
  return !!token.value
}

function getToken() {
  return token.value
}

function setToken(newToken: string) {
  token.value = newToken
}

function clearToken() {
  token.value = null
}

function refreshToken(newToken?: string | null) {
  if (newToken && newToken !== token.value) {
    setToken(newToken)
    window.malanApp.callHandler('refreshToken', { newToken })
  }
}

export { isLogin, getToken, setToken, clearToken, refreshToken }
