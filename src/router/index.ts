import { createRouter, createWebHashHistory } from 'vue-router'
import MainView from '../views/MainView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainView,
      children: [{
        path: '', name: 'home', // 主页
        component: () => import('../components/Home/HomeComp.vue'),
      }, {
        path: 'mylog', name: 'mylog', // 我的记录页
        component: () => import('../components/Log/LogComp.vue'),
      },]
    },
    {
      path: '/login',
      component: () => import('../views/LoginView.vue'),
      children: [{
        path: '', name: 'login', // 登录
        component: () => import('../components/Login/LoginComp.vue'),
      }, {
        path: 'signin', name: 'signin', // 注册
        component: () => import('../components/Login/SigninComp.vue'),
      },]
    },
    {
      path: '/:pathMatch(.*)*', name: '404',
      component: () => import('../views/NotFound.vue'),
    },
  ]
})

export default router
