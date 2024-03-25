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
          component: () => import('../views/home/index.vue'),
        },
        {
          path: 'logger',
          name: 'logger', // 我的主页（别人看的）
          component: () => import('../views/logger/index.vue'),
        },
        {
          path: 'mylog',
          name: 'mylog', // 我的记录（自己看的）
          component: () => import('../views/mylog/index.vue'),
          children: [
            {
              path: '',
              name: 'timeline', // 时间线
              component: () =>
                import('../components/Pages/Mylog/TimelineComp.vue'),
            },
            {
              path: 'todo',
              name: 'todo', // 待办
              component: () => import('../components/Pages/Mylog/TodoComp.vue'),
            },
            {
              path: 'calendar',
              name: 'calendar', // 日历
              component: () =>
                import('../components/Pages/Mylog/CalendarComp.vue'),
            },
          ],
        },
        {
          path: 'album',
          name: 'album', // 相册
          component: () => import('../views/album/index.vue'),
        },
        {
          path: 'map',
          name: 'map', // 地图
          component: () => import('../views/map/index.vue'),
        },
        {
          path: 'relation',
          name: 'relation', // 人脉
          component: () => import('../views/relation/index.vue'),
        },
      ],
    },
    {
      path: '/login',
      component: () => import('../views/login/index.vue'),
      children: [
        {
          path: '',
          name: 'login', // 登录
          component: () => import('../components/Pages/Login/LoginComp.vue'),
        },
        {
          path: 'signin',
          name: 'signin', // 注册
          component: () => import('../components/Pages/Login/SigninComp.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('../views/404/index.vue'),
    },
  ],
})

export default router
