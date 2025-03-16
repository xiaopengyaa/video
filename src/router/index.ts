import { createRouter, createWebHashHistory } from 'vue-router/auto'
import { handleHotUpdate, routes } from 'vue-router/auto-routes'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: true, parent: '#app' })

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// 自动加载pages目录下的vue文件
if (import.meta.hot) {
  handleHotUpdate(router)
}

router.beforeEach(async () => {
  NProgress.start()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
