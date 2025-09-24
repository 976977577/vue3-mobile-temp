import request from '@/utils/request'

export interface LoginData {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  password: string
  confirmPassword: string
}

export interface LoginRes {
  token: string
}

export interface UserState {
  uid?: number
  username?: string
  avatar?: string
}

/**
 * 用户登录
 * @param data 登录数据
 * @returns 登录结果
 */
export function login(data: LoginData): Promise<any> {
  return request.post<LoginRes>('/auth/login', data)
}

/**
 * 用户注册
 * @param data 注册数据
 * @returns 注册结果
 */
export function register(data: RegisterData): Promise<any> {
  return request.post('/auth/register', data)
}

/**
 * 用户退出登录
 * @returns 退出结果
 */
export function logout() {
  return request.post('/auth/logout')
}

/**
 * 获取用户信息
 * @returns 用户信息
 */
export function getUserInfo(): Promise<any> {
  return request.get<UserState>('/user/me')
}
