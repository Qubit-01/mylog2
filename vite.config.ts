import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      // element 自动导入组件
      resolvers: [ElementPlusResolver()],
      // 自动导入 vue 常见函数
      imports: ["vue", "vue-router", "pinia"],
      // 导入的函数给编辑器看的类型文件
      dts: 'src/auto-imports.d.ts',
      eslintrc: { enabled: true },
    }),
    Components({ resolvers: [ElementPlusResolver()] }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0', //显示当前局域网地址
    open: true, //是否自动启动浏览器
  },
})
