import { createRouter, createWebHashHistory } from 'vue-router'
import MainView from '../views/MainView.vue'

// 下面写路径太繁琐了，这里加个前缀
const getMainPage = (name: string) =>
  `../components/MainPage/${name}/${name}Page.vue`

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
          component: () => import(getMainPage('Home')),
        },
        {
          path: 'logger',
          name: 'logger', // 我的主页（别人看的）
          component: () => import(getMainPage('Logger')),
        },
        {
          path: 'mylog',
          name: 'mylog', // 我的记录（自己看的）
          component: () => import(getMainPage('Mylog')),
        },
        {
          path: 'map',
          name: 'map',
          component: () => import(getMainPage('Map')),
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
