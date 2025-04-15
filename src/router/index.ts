import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useAuthStore } from '@/store/auth'

NProgress.configure({ showSpinner: true, parent: '#app' })

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      requiresAuth: false,
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/login/register.vue'),
    meta: {
      title: '注册',
      requiresAuth: false,
    },
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '首页',
      keepAlive: 'home',
      requiresAuth: true,
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/home/profile.vue'),
    meta: {
      title: '个人主页',
      requiresAuth: true,
    },
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import('@/views/detail/index.vue'),
    meta: {
      title: '视频详情',
      requiresAuth: true,
    },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  // 开始进度条
  NProgress.start()

  // 不需要登录的页面直接放行
  if (!to.meta.requiresAuth) {
    next()
    return
  }

  // 需要登录但没有token，跳转到登录页
  if (!authStore.accessToken) {
    next({
      path: '/login',
      query: { redirect: to.fullPath },
    })
    return
  }

  // 有token但没有用户信息，获取用户信息
  if (!authStore.userInfo) {
    const success = await authStore.getUserInfoAction()
    if (!success) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      })
      return
    }
  }

  next()
})

router.afterEach(() => {
  // 结束进度条
  NProgress.done()
})

export default router
