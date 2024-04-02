import { defineConfig } from 'vitepress'
import sidebar from './sidebar.mjs'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "SoftLeaderGy",
  description: "一个旨在记录、分享java相关技术的知识库。同时本人会不定时在另一个博客分享自己的文章，可点击“GuoYang文章小记”浏览哦～，自己记录，分享他人。知识库、文章小记中所有笔记都是自己学习、工作中所写，如有问题，请多多指教～",
  srcDir: 'docs',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],
    // 全文搜索
    search: {
      provider: 'local'
    },
    // sidebar: {...sidebar} as any,
    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      },
      {
        text: '缓存篇',
        items: [
          { text: 'redis', link: '/缓存篇/redis' }
        ]
      }
    ],
    footer: {
      copyright: 'SoftleaderGy '
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
