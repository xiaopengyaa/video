import type { LoginParams, RefreshTokenResult, RegisterParams, UserInfo } from '@/types/auth'
import { getUserInfo, login, logout, refreshToken, register } from '@/api/auth'
import { showToast } from 'vant'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string>(localStorage.getItem('accessToken') || '')
  const refreshTokenValue = ref<string>(localStorage.getItem('refreshToken') || '')
  const userInfo = ref<UserInfo | null>(null)
  const loading = ref(false)
  let refreshPromise: Promise<RefreshTokenResult> | null = null

  function setTokens(tokens: { accessToken: string, refreshToken: string }) {
    accessToken.value = tokens.accessToken
    refreshTokenValue.value = tokens.refreshToken
    localStorage.setItem('accessToken', tokens.accessToken)
    localStorage.setItem('refreshToken', tokens.refreshToken)
  }

  function clearTokens() {
    accessToken.value = ''
    refreshTokenValue.value = ''
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  async function refreshTokens() {
    try {
      // 如果已经在刷新中，返回正在进行的刷新promise
      if (refreshPromise) {
        return refreshPromise
      }

      // 创建新的刷新promise
      refreshPromise = refreshToken(refreshTokenValue.value)

      const result = await refreshPromise
      setTokens(result)
      return result
    }
    catch (error) {
      clearTokens()
      throw error
    }
    finally {
      refreshPromise = null
    }
  }

  async function loginAction(params: LoginParams) {
    loading.value = true
    try {
      const result = await login(params)
      if (result.flag) {
        const data = result.data
        setTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        })
        userInfo.value = data.user
        return true
      }
      else {
        showToast(result.message)
        return false
      }
    }
    catch (error) {
      return false
    }
    finally {
      loading.value = false
    }
  }

  async function registerAction(params: RegisterParams) {
    loading.value = true
    try {
      const result = await register(params)
      if (result.flag) {
        return true
      }
      else {
        showToast(result.message)
        return false
      }
    }
    catch (error) {
      return false
    }
    finally {
      loading.value = false
    }
  }

  async function logoutAction() {
    loading.value = true
    try {
      await logout()
      clearTokens()
      userInfo.value = null
      return true
    }
    catch (error) {
      return false
    }
    finally {
      loading.value = false
    }
  }

  async function getUserInfoAction() {
    loading.value = true
    try {
      const info = await getUserInfo()
      userInfo.value = info
      return true
    }
    catch (error) {
      return false
    }
    finally {
      loading.value = false
    }
  }

  return {
    accessToken,
    refreshToken: refreshTokenValue,
    userInfo,
    loading,
    loginAction,
    registerAction,
    logoutAction,
    getUserInfoAction,
    refreshTokens,
  }
})
