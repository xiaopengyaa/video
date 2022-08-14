import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 全局引入css
import '@/assets/css/index.scss'

createApp(App).use(router).mount('#app')
