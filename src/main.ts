import './assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs' // element 国际化
import 'dayjs/locale/zh-cn' // element 用的dayjs要设置时区
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(ElementPlus, { locale: zhCn })
app.use(router)

app.mount('#app')
