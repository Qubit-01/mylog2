import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs' // element 国际化
import * as Icons from '@element-plus/icons-vue' // element 图标
import 'dayjs/locale/zh-cn' // element 用的dayjs要设置时区
import App from './App.vue'
import router from './router'
import axios from 'axios'

import './assets/css/base.less'

// axios.defaults.baseURL = 'https://localhost:8081'
axios.defaults.baseURL = 'https://mylog.cool:8081'
// axios 默认json，但是后端要加注解，麻烦
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

const app = createApp(App)

app.use(createPinia())
app.use(ElementPlus, { locale: zhCn })
app.use(router)
// 注册所有element图标组件
for (const [k, c] of Object.entries(Icons)) app.component(k, c)
// 注册指令：给元素加-m的class
app.directive('m', dom => dom.classList.add('-m'))


app.mount('#app')

