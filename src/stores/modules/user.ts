import { ref } from 'vue'
import { queryUserInfo } from '@/api/user'
import { defineStore } from 'pinia'

export interface UserState {
  id: string
  nickname: string
  headerImg: string
  isReal: boolean
  goldCoins: number
  phone: string
  invitationCode: string
  isMemberTeacher: boolean
  createTime: string
  [key: string]: any
}

const initUserInfo = {
  id: '',
  nickname: '',
  headerImg: '',
  isReal: false,
  goldCoins: 0,
  phone: '',
  invitationCode: '',
  isMemberTeacher: false,
  createTime: ''
}

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref<UserState>({ ...initUserInfo })

    const setInfo = (partial: Partial<UserState>) => {
      userInfo.value = { ...userInfo.value, ...partial }
    }

    const refresh = async () => {
      const { data } = await queryUserInfo()
      setInfo(data)
    }
    return { userInfo, setInfo, refresh }
  },
  {
    persist: true
  }
)
