import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "多元记",
  description: "把你写成书~",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '简介', link: '/简介' }
    ],

    sidebar: [
      {
        text: '简介',
        items: [
          { text: '什么是多元记？', link: '/简介' },
          { text: '快速开始', link: '/快速开始' }
        ]
      },
      {
        text: '记录',
        items: [
          { text: '开始你的第一条记录', link: '/简介' },
          { text: '快速开始', link: '/快速开始' }
        ]
      },
      {
        text: '其他功能',
        items: [
          { text: '开始你的第一条记录', link: '/简介' },
          { text: '快速开始', link: '/快速开始' }
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Qubit-01/mylog2' },
    ]
  }
})
