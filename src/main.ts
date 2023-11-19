import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Lazyload } from 'vant'
import browser from './utils/page-check'

// 判断是否pc设备打开
if (
  import.meta.env.PROD &&
  !browser.versions.mobile &&
  window.top === window.self
) {
  const mobileUrl = `${import.meta.env.VITE_APP_TO_PC}`
  location.href = mobileUrl
}

// 全局引入css
import '@/assets/css/index.scss'

createApp(App).use(Lazyload).use(router).mount('#app')
