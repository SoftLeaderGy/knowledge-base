import { defineConfig } from 'vitepress'
import sidebar from './sidebar.mjs'
import nav from "./nav.mjs";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "SoftLeaderGy",
  description: "一个旨在记录、分享java相关技术的知识库。同时本人会不定时在另一个博客分享自己的文章，可点击“GuoYang文章小记”浏览哦～，自己记录，分享他人。知识库、文章小记中所有笔记都是自己学习、工作中所写，如有问题，请多多指教～",
  srcDir: 'docs',
  ignoreDeadLinks: true,
  themeConfig: {
    lastUpdated: {
      text: '最后更新于',
      // dateStyle 、 timeStyle 参数：short、full、medium
      formatOptions: {
        // @ts-ignore
        dateStyle: 'short',
        // timeStyle: 'medium'
      }
    },
    // 目录层级，显示几级，outline: [1,4] 表示显示1到4级的标题
    outline: [1,4],
    // 目录标题
    outlineTitle: 'On the Page',
    // logo，需要放在public文件夹下
    logo: '/logo.svg',
    // https://vitepress.dev/reference/default-theme-config
    // @ts-ignore
    nav: [
        ...nav
    ],
    // 全文搜索
    search: {
      provider: 'local'
    },
    // sidebar: {...sidebar} as any,
    sidebar: [
      ...sidebar,
    ],
    footer: {
      message: '<a href="https://github.com/SoftLeaderGy">SoftleaderGy</a>版权所有，创作不易。请尊重他人劳动成果，未经授权禁止转载。<a href="https://beian.miit.gov.cn/">辽ICP备2024027609</a>',
      // copyright: '版权所有@2018-2024创作不易，请尊重他人劳动成果，未经授权禁止转载。'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/SoftLeaderGy' }
    ]
  }
})
