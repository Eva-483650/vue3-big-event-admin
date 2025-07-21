import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'
// 初始化 vue-router4.x(vue3)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/LoginPage.vue')
    },
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: { name: 'ArticleManage' },
      children: [
        {
          path: '/article/manage',
          name: 'ArticleManage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/article/channel',
          name: 'ArticleChannel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: '/user/profile',
          name: 'UserProfile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/user/avatar',
          name: 'UserAvatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
          name: 'UserPassword',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ]
})

// 登录访问拦截 默认直接放行
// 根据返回值决定是放行还是拦截
// 返回值：
// 1. undefined true 放行
// 2. false 拦截回from的地址页面
// 具体路径或者路径对象 拦截到对应的地址
// to：即将要进入的目标路由对象
// from：当前导航正要离开的路由对象
router.beforeEach((to) => {
  // 如果没有token且访问的是非登录页，拦截到登录
  const userStore = useUserStore() // 假设你有一个用户状态管理
  if (!userStore.isAuthenticated && to.name !== 'Login') {
    // 将用户重定向到登录页面
    return { name: 'Login' }
  }
})

export default router
