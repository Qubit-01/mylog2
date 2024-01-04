// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/theme-chalk/dark/css-vars.css' // 暗黑模式
import 'dayjs/locale/zh-cn'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus, { locale: zhCn }) // { size: 'small', zIndex: 3000, locale: zhCn } 可以指定默认组件size和zIndex

app.mount('#app')
