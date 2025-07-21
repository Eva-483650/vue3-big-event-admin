import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userGetInfoService } from '@/api/user'

// 用户模块 token setToken removeToken
export const useUserStore = defineStore(
  'big-user',
  () => {
    const token = ref('')
    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }
    // isAuthenticated登录状态
    const isAuthenticated = computed(() => !!token.value)

    const user = ref({})
    const getUser = async () => {
      const res = await userGetInfoService()
      // res.data是整个后台返回的结果
      user.value = res.data.data
    }
    const setUser = (obj) => {
      user.value = obj
    }
    return {
      token,
      setToken,
      removeToken,
      isAuthenticated,
      user,
      getUser,
      setUser
    }
  },
  {
    persist: true // 持久化存储
  }
)
