import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { showNotify } from 'vant'
import { STORAGE_TOKEN_KEY } from '@/stores/mutation-type'
import { refreshToken } from '@/utils/auth'

export type RequestError = AxiosError<{
  message?: string
  result?: any
  errorMessage?: string
  code?: number
}>

const request = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  timeout: 6000
})

function getErrorMessage(error: RequestError, fallback: string): string {
  const { data, statusText } = error.response || {}
  return data?.message || data?.errorMessage || statusText || fallback
}

function handleUnauthorizedError(_error: RequestError): void {
  showNotify({
    type: 'danger',
    message: 'Token异常,请重新登录!'
  })

  // TODO: 根据业务需求决定是否自动跳转到登录页
  // router.push('/login')
}

function handleForbiddenError(_error: RequestError): void {
  showNotify({
    type: 'danger',
    message: '权限不足，无法访问该资源'
  })
}

function checkAndRefreshToken(headers: any): void {
  const newToken = headers['new-token'] || headers.new_token
  if (newToken) {
    refreshToken(newToken)
  }
}

function errorHandler(error: RequestError): Promise<never> {
  const { status, headers, data } = error.response
  checkAndRefreshToken(headers)

  // 先处理 HTTP 状态码错误（网络层错误，如 503 服务不可用）
  if (status !== 200) {
    showNotify({
      type: 'danger',
      message: getErrorMessage(error, '网络异常，请稍后重试')
    })
    return Promise.reject(error)
  }

  // 处理业务层错误（响应数据中的 code）
  const businessCode = data?.code
  if (businessCode) {
    switch (businessCode) {
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
  }
  else {
    // 没有业务 code 的情况
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
  //  根据之前的项目判断保存同步，固定200
  if (response.data.code === 200) {
    checkAndRefreshToken(response.headers)
    return response.data
  }

  // 非 200 状态码，构造错误对象并通过 errorHandler 处理
  const error: RequestError = {
    response,
    config: response.config,
    request: response.request,
    isAxiosError: true,
    toJSON: () => ({}),
    name: 'AxiosError',
    message: response.data?.message || response.data?.msg || `Request failed with status ${response.status}`
  }

  return errorHandler(error)
}

// 注册拦截器
request.interceptors.request.use(requestHandler, errorHandler)
request.interceptors.response.use(responseHandler, errorHandler)

export default request
