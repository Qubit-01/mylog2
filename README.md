# mylog2

This template should help get you started developing with Vue 3 in Vite.





## 一些element的操作
```js
// 亮暗主题切换
import { useDark, useToggle } from '@vueuse/core'
const isDark = useDark()
const toggleDark = useToggle(isDark)
// 调用 toggleDark() 即可改变主题


// main.ts 自定义主题css
import 'element-plus/theme-chalk/dark/css-vars.css'
import './styles/dark/css-vars.css'  // 自己新建一个css文件，在官方的后面导入即可覆盖
// 里面的样式自己覆盖
html.dark {
  --el-bg-color: #626aef; /* 自定义深色背景颜色 */
}


// 过度动画，show控制显示
<transition name="el-fade-in-linear">
    <div v-show="show" class="transition-box">.el-fade-in-linear</div>
</transition>
```