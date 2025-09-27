import request from '@/utils/request'

/**
 * 获取用户信息
 * @returns 用户信息
 */
export function queryUserInfo() {
  return request('/member/v1/user/info', {
    method: 'POST'
  })
}
