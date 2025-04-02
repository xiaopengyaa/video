import { createApp } from 'vue'
import { createHead } from '@unhead/vue'
import App from '@/App.vue'
import router from '@/router'
import { createPinia } from 'pinia'
import browser from '@/utils/page-check'
// Vant桌面端适配
import '@vant/touch-emulator'
// Vant懒加载
import { Lazyload } from 'vant'
// Vant手动引入样式
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import 'vant/es/image-preview/style'
// 全局引入css
import 'normalize.css'
import '@/assets/iconfont/iconfont.css'
import '@/assets/css/common.scss'

// 判断是否pc设备打开
if (
  import.meta.env.PROD
    && !browser.versions.mobile
    && window.top === window.self
) {
  const mobileUrl = `${import.meta.env.VITE_APP_TO_PC}`
  location.href = mobileUrl
}

const app = createApp(App)
const pinia = createPinia()
const head = createHead()

app.use(Lazyload, {
  lazyComponent: true,
})
app.use(head)
app.use(router)
app.use(pinia)

app.mount('#app')
