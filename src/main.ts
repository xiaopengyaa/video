import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Lazyload } from 'vant'

// 全局引入css
import '@/assets/css/index.scss'

createApp(App).use(Lazyload).use(router).mount('#app')
