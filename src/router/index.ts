import { createRouter, createWebHashHistory } from 'vue-router'
import MainView from '../views/MainView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainView,
      children: [
        {
          path: '',
          name: 'home', // 主页
          component: () => import("../components/MainPage/Home/HomePage.vue"),
        },
        {
          path: 'logger',
          name: 'logger', // 我的主页（别人看的）
          component: () => import('../components/MainPage/Logger/LoggerPage.vue'),
        },
        {
          path: 'mylog',
          name: 'mylog', // 我的记录（自己看的）
          component: () => import('../components/MainPage/Mylog/MylogPage.vue'),
        },
        {
          path: 'map',
          name: 'map',
          component: () => import('../components/MainPage/Map/MapPage.vue'),
        },
      ],
    },
    {
      path: '/login',
      component: () => import('../views/LoginView.vue'),
      children: [
        {
          path: '',
          name: 'login', // 登录
          component: () => import('../components/Login/LoginComp.vue'),
        },
        {
          path: 'signin',
          name: 'signin', // 注册
          component: () => import('../components/Login/SigninComp.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('../views/NotFound.vue'),
    },
  ],
})

export default router
