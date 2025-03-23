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

// request拦截器
service.interceptors.request.use(
  (config) => {
    const enableCancel = config.headers?.['X-Cancel-Previous'] === '1'

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
    if (response.status !== 200 || response.data.code !== Code.ERR_OK) {
      !hideTips && showToast('请求失败')
    }
    return response
  },
  (err) => {
    const data = err.response && err.response.data
    const hideTips = err.config?.headers?.['X-Hide-Tips'] === '1'

    if (!axios.isCancel(err)) {
      const requestKey = generateRequestKey(err.config)
      pendingRequests.delete(requestKey)
    }

    if (err && err.code === 'ECONNABORTED') {
      !hideTips && showToast('兄弟，\n你这是网络不好呀=。=')
    }
    else {
      !hideTips && showToast('请求失败')
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
