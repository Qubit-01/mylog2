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

import './assets/css/base.less' // 全局样式

import 'default-passive-events' // 浏览器警告：解决移动端滚动卡顿问题

const app = createApp(App)

app.use(createPinia())
app.use(ElementPlus, { locale: zhCn })
app.use(router)
// 注册所有element图标组件
for (const [k, c] of Object.entries(Icons)) app.component(k, c)
// 注册指令：给元素加-m的class
app.directive('m', (dom) => dom.classList.add('-m'))
// 注册指令：超出省略号，传入行数，默认一行，0就啥都不干
app.directive('overflowEllipsis', (el, { value = 1 }) => {
  if (value === 0) {
    // 删除样式
    el.classList.remove('-overflow-ellipsis-s', '-overflow-ellipsis-m')
    el.style.webkitLineClamp = 'revert'
  } else if (value === 1) {
    el.classList.add('-overflow-ellipsis-s')
    el.classList.remove('-overflow-ellipsis-m')
    el.style.webkitLineClamp = 'revert'
  } else {
    el.classList.remove('-overflow-ellipsis-s')
    el.classList.add('-overflow-ellipsis-m')
    el.style.webkitLineClamp = value
  }
})

app.mount('#app')
