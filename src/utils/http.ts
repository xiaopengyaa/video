/*
 * @Author: xiaopengyaa
 * @Date: 2020-03-02 11:47:04
 * @Description: axios封装
 */
import axios from 'axios'
import { ResData } from '@/types/base'
import { Code } from '@/types/enum'
import { Toast } from 'vant'
import 'vant/es/toast/style'

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL, // 数据接口域名统一配置
  timeout: 1000 * 20, // 默认超时时间20s
})

// request拦截器
service.interceptors.request.use(
  (config) => {
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

// response拦截器
service.interceptors.response.use(
  (response) => {
    if (response.status != 200 || response.data.code !== Code.ERR_OK) {
      Toast.fail('请求失败')
    }
    return response
  },
  (err) => {
    const data = err.response && err.response.data

    if (err && err.code === 'ECONNABORTED') {
      Toast('兄弟，\n你这是网络不好呀=。=')
    } else {
      Toast.fail('请求失败')
    }

    return Promise.reject(data || err)
  }
)

// 封装get、post方法
const http = {
  async get<T = unknown>(url: string, data = {}, config = {}) {
    try {
      const res = await service.get<ResData<T>>(url, {
        params: data,
        ...config,
      })
      const serverData = res.data
      return Promise.resolve(serverData.result)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  async post<T = unknown>(url: string, data = {}, config = {}) {
    try {
      const res = await service.post<ResData<T>>(url, data, config)
      const serverData = res.data
      return Promise.resolve(serverData.result)
    } catch (err) {
      return Promise.reject(err)
    }
  },
}

export default http
