import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { showNotify } from 'vant'
import { STORAGE_TOKEN_KEY } from '@/stores/mutation-type'
import { refreshToken } from '@/utils/auth'

export type RequestError = AxiosError<{
  message?: string
  result?: any
  errorMessage?: string
}>

const request = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  timeout: 6000
})

function getErrorMessage(error: RequestError, fallback: string): string {
  const { data, statusText } = error.response || {}
  return data?.message || data?.errorMessage || statusText || fallback
}

function handleUnauthorizedError(error: RequestError): void {
  const { data } = error.response || {}
  showNotify({
    type: 'danger',
    message: '授权验证失败，请重新登录'
  })

  console.log('授权验证失败', data)
  // TODO: 根据业务需求决定是否自动跳转到登录页
  // router.push('/login')
}

function handleForbiddenError(error: RequestError): void {
  showNotify({
    type: 'danger',
    message: getErrorMessage(error, '权限不足，无法访问该资源')
  })
}

function checkAndRefreshToken(headers: any): void {
  const newToken = headers['new-token'] || headers.new_token
  if (newToken) {
    refreshToken(newToken)
  }
}

function errorHandler(error: RequestError): Promise<never> {
  if (!error.response) {
    showNotify({ type: 'danger', message: '网络错误，请检查您的网络连接' })
    return Promise.reject(error)
  }

  const { status, headers } = error.response
  checkAndRefreshToken(headers)

  switch (status) {
    case 401:
      handleUnauthorizedError(error)
      break
    case 403:
      handleForbiddenError(error)
      break
    default:
      showNotify({
        type: 'danger',
        message: getErrorMessage(error, '小兰忙碌中')
      })
  }

  return Promise.reject(error)
}

function requestHandler(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const savedToken = localStorage.getItem(STORAGE_TOKEN_KEY)

  config.headers.tenantId = 'mledu'
  config.headers.orgCode = 'mleduorg'

  if (savedToken) {
    config.headers.Authorization = savedToken
  }

  return config
}

function responseHandler(response: AxiosResponse): any {
  checkAndRefreshToken(response.headers)
  return response.data
}

// 注册拦截器
request.interceptors.request.use(requestHandler, errorHandler)
request.interceptors.response.use(responseHandler, errorHandler)

export default request
