/*
 * @Author: xiaopengyaa
 * @Date: 2025-03-02 11:47:04
 * @Description: axios封装
 */
import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import type { ResData } from '@/types/base'
import { Code } from '@/types/enum'
import { showToast } from 'vant'
import 'vant/es/toast/style'
import router from '@/router'
import { useAuthStore } from '@/store/auth'

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL, // 数据接口域名统一配置
  timeout: 1000 * 20, // 默认超时时间20s
})

// 存储进行中的请求
const pendingRequests = new Map<string, AbortController>()
// 生成唯一请求标识
function generateRequestKey(config: AxiosRequestConfig) {
  const { url = 'default' } = config
  return url
}

function toLogin(hideTips) {
  // 如果已经跳转到登录页，则不跳转
  if (router.currentRoute.value.name === 'login') {
    return
  }
  // 校验失败，跳转登录页
  router.push({
    name: 'login',
    query: { redirect: router.currentRoute.value.fullPath },
  })
  !hideTips && showToast('登录已过期，请重新登录')
}

// request拦截器
service.interceptors.request.use(
  (config) => {
    const enableCancel = config.headers?.['X-Cancel-Previous'] === '1'
    const accessToken = localStorage.getItem('accessToken')

    if (enableCancel) {
      const requestKey = generateRequestKey(config)
      const controller = new AbortController()

      // 取消重复请求
      if (pendingRequests.has(requestKey)) {
        pendingRequests.get(requestKey)?.abort()
        pendingRequests.delete(requestKey)
      }

      // 存储新请求
      config.signal = controller.signal
      pendingRequests.set(requestKey, controller)
    }

    if (accessToken && !config.url?.includes('/auth/refresh')) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (err) => {
    return Promise.reject(err)
  },
)

// response拦截器
service.interceptors.response.use(
  (response) => {
    const hideTips = response.config.headers['X-Hide-Tips'] === '1'
    // 清理请求记录
    const requestKey = generateRequestKey(response.config)
    pendingRequests.delete(requestKey)
    // 响应处理
    const { code, message } = response.data

    // 如果后端返回的是文件流，直接返回
    if (response.config.responseType === 'blob') {
      return response
    }

    // 如果后端返回的是200，直接返回
    if (response.status === 200 && code === Code.ERR_OK) {
      return response
    }

    !hideTips && showToast(message || '请求失败')
    return Promise.reject(new Error(message || '请求失败'))
  },
  async (err) => {
    const data = err.response?.data
    const config = err.config
    const hideTips = config?.headers?.['X-Hide-Tips'] === '1'

    if (!axios.isCancel(err)) {
      const requestKey = generateRequestKey(config)
      pendingRequests.delete(requestKey)
    }

    if (err.code === 'ECONNABORTED') {
      !hideTips && showToast('兄弟，\n你这是网络不好呀=。=')
    }
    else if (err.response?.status === 401) {
      // 如果是刷新token的请求失败，直接退出登录
      if (config.url?.includes('/auth/refresh')) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        toLogin(hideTips)
      }
      else {
        try {
          // 尝试刷新token
          const authStore = useAuthStore()
          const result = await authStore.refreshTokens()

          // 使用新token重试请求
          config.headers.Authorization = `Bearer ${result.accessToken}`
          return service(config)
        }
        catch (refreshError) {
          toLogin(hideTips)
        }
      }
    }
    else {
      !hideTips && showToast(data?.message || '请求失败')
    }

    return Promise.reject(data || err)
  },
)

// 封装get、post方法
const http = {
  async get<T = unknown>(url: string, data = {}, config?: AxiosRequestConfig) {
    try {
      const res = await service.get<ResData<T>>(url, {
        params: data,
        ...config,
      })
      const serverData = res.data
      return Promise.resolve(serverData.data)
    }
    catch (err) {
      return Promise.reject(err)
    }
  },
  async post<T = unknown>(url: string, data = {}, config?: AxiosRequestConfig) {
    try {
      const res = await service.post<ResData<T>>(url, data, config)
      const serverData = res.data
      return Promise.resolve(serverData.data)
    }
    catch (err) {
      return Promise.reject(err)
    }
  },
}

export default http
