import { defineConfig } from 'vitepress'
import sidebar from './sidebar.mjs'

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
    nav: [
      { text: '首页', link: '/' },
      {
        text: '日常积累',
        items: [
          { text: '多线程专题', link: '/日常积累/多线程专题/多线程专题.md' },
          { text: '配置CORS跨域', link: '/日常积累/配置CORS跨域/配置CORS跨域.md' },
          { text: '全局参数、异常处理', link: '/日常积累/全局参数、异常处理/全局参数、异常处理.md' },
          { text: 'CPU飙升排查', link: '/日常积累/CPU飙升排查/CPU飙升排查.md' },
          { text: 'Excel处理', link: '/日常积累/Excel处理/Excel处理.md' },
          { text: 'JSON小记', link: '/日常积累/JSON小记/JSON小记.md' },
          { text: 'nginx代理DB、ip限制', link: '/日常积累/nginx代理DB、ip限制/nginx代理DB、ip限制.md' },
          { text: 'nginx线上流量复制', link: '/日常积累/nginx线上流量复制/nginx线上流量复制.md' },
          { text: 'post和RequestBody', link: '/日常积累/post和RequestBody/post和RequestBody.md' },
          { text: 'redis+lua接口限流方案', link: '/日常积累/redis+lua接口限流方案/redis+lua接口限流方案.md' },
          { text: 'Stream流', link: '/日常积累/Stream流/Stream流.md' },
        ]
      },
      {
        text: '漏洞修复',
        items: [
          { text: 'nginx漏洞修复', link: '/漏洞修复/nginx漏洞修复/nginx漏洞修复.md' },
          { text: 'springboot关闭druid监控', link: '/漏洞修复/springboot关闭druid监控/springboot关闭druid监控.md' }
        ]
      },
      {
        text: 'Mac相关',
        items: [
          { text: 'Mac-配置', link: '/Mac相关/Mac-配置/Mac-配置.md' },
          { text: 'Mac解决安装软件文件损坏问题', link: '/Mac相关/Mac解决安装软件文件损坏问题/Mac解决安装软件文件损坏问题.md' },
          { text: 'notion_for_mac改中文语言', link: '/Mac相关/notion_for_mac改中文语言/notion_for_mac改中文语言.md' }
        ]
      },
      {
        text: '乱七八糟教程',
        items: [
          { text: 'Github搭建图床', link: '/乱七八糟教程/Github搭建图床/Github搭建图床.md' },
          { text: '语雀导出文件图片CND指向问题', link: '/乱七八糟教程/语雀导出文件图片CND指向问题/语雀导出文件图片CND指向问题.md' },
          { text: '解决有道云笔记导出md文件', link: '/乱七八糟教程/解决有道云笔记导出md文件/解决有道云笔记导出md文件.md' },
        ]
      },
    ],
    // 全文搜索
    search: {
      provider: 'local'
    },
    // sidebar: {...sidebar} as any,
    sidebar: [
      // {
      //   text: 'Examples',
      //   items: [
      //     { text: 'Markdown Examples', link: '/markdown-examples' },
      //     { text: 'Runtime API Examples', link: '/api-examples' }
      //   ]
      // },
      {
        text: '开源组件构建集成',
        items: [
          { text: 'Arthas', link: '/开源组件构建集成/Arthas/Arthas.md' },
          { text: 'EasyExcel', link: '/开源组件构建集成/EasyExcel/EasyExcel.md' },
          { text: 'HertzBeat监控搭建', link: '/开源组件构建集成/HertzBeat监控搭建/HertzBeat监控搭建.md' },
          { text: 'kkFileView集成部署', link: '/开源组件构建集成/kkFileView集成部署/kkFileView集成部署.md' },
          { text: 'MybatisPlusdynamic', link: '/开源组件构建集成/MybatisPlusdynamic/MybatisPlusdynamic.md' },
          { text: 'sensitive-word敏感词过滤', link: '/开源组件构建集成/sensitive-word敏感词过滤/sensitive-word敏感词过滤.md' },
          { text: 'xxl-job搭建', link: '/开源组件构建集成/xxl-job搭建/xxl-job搭建.md' },
        ]
      },
      {
        text: 'Java基础',
        items: [
          { text: 'Java基础', link: '/Java基础/Java基础/Java.md' },
        ]
      },
      {
        text: '微服务篇',
        items: [
          { text: 'SpringBoot配置拦截器', link: '/微服务篇/SpringBoot配置拦截器/SpringBoot配置拦截器.md' },
          { text: 'boot相关图解', link: '/微服务篇/boot相关图解/boot相关图解.md' },
          { text: 'springcloudV2.0', link: '/微服务篇/springcloudV2.0/springcloudV2.0.md' }
        ]
      },
      {
        text: '数据库篇',
        items: [
          {
            text: 'mysql',
            items: [
              { text: 'mysql积累', link: '/数据库篇/mysql/mysql积累/mysql积累.md' },
              { text: 'mysql相关问题解决', link: '/数据库篇/mysql/mysql相关问题解决/mysql相关问题解决.md' }
            ]
          },
        ]
      },
      {
        text: '持久框架篇',
        items: [
          { text: 'Mybatis', link: '/持久框架篇/Mybatis/Mybatis.md' },
          { text: 'MybatisPlus', link: '/持久框架篇/MybatisPlus/MybatisPlus.md' }
        ]
      },
      {
        text: '服务治理篇',
        items: [
          { text: 'Eureka', link: '/服务治理篇/Eureka/Eureka.md' },
          { text: 'Zookeeper', link: '/服务治理篇/zookeeper/zookeeper.md' },
          { text: 'Nacos', link: '/服务治理篇/Nacos/Nacos.md' },
          { text: 'Eureka、Zk、Consul对比', link: '/服务治理篇/Eureka、Zk、Consul对比/Eureka、Zk、Consul对比.md' }
        ]
      },
      {
        text: '缓存篇',
        items: [
          { text: 'Redis', link: '/缓存篇/redis' }
        ]
      },
      {
        text: 'MQ篇',
        items: [
          { text: 'RabbitMQ', link: '/MQ篇/RabbitMQ/RabbitMQ.md' },
        ]
      },
      {
        text: '版本控制',
        items: [
          { text: 'Git积累', link: '/版本控制/Git积累/Git积累.md' }
        ]
      },
      {
        text: '加解密',
        items: [
          { text: '国密-SM2', link: '/加解密/国密-SM2/国密-SM2.md' }
        ]
      },
      {
        text: '数据结构&算法篇',
        items: [
          { text: '数据结构-前缀数', link: '/数据结构&算法篇/数据结构-前缀数/数据结构-前缀数.md' }
        ]
      },
      {
        text: 'JVM篇',
        items: [
          { text: 'JVM初探', link: '/JVM篇/JVM初探/JVM初探.md' },
          { text: 'JVM图解', link: '/JVM篇/JVM图解/JVM图解.md' },
        ]
      },
      {
        text: 'Linux积累篇',
        items: [
          { text: 'Linux', link: '/Linux积累篇/Linux/Linux.md' },
        ]
      },
      {
        text: 'Nginx篇',
        items: [
          { text: 'nginx-end', link: '/Nginx篇/nginx-end/nginx-end.md' },
          { text: 'nginx实战积累', link: '/Nginx篇/nginx实战积累/nginx实战积累.md' },
        ]
      },
      {
        text: 'Docker',
        items: [
          { text: 'docker基础', link: '/Docker/docker基础/docker基础.md' },
          { text: 'docker积累', link: '/Docker/docker积累/docker积累.md' },
          { text: 'docker基于aipine基础镜像与部署jar包', link: '/Docker/docker基于aipine基础镜像与部署jar包/docker基于aipine基础镜像与部署jar包.md' },
        ]
      },
      {
        text: '项目部署篇',
        items: [
          { text: 'java部署', link: '/项目部署篇/java部署/java部署.md' },
          { text: 'mysql部署', link: '/项目部署篇/mysql部署/mysql部署.md' },
          { text: 'nacos部署', link: '/项目部署篇/nacos部署/nacos部署.md' },
          { text: 'nginx部署', link: '/项目部署篇/nginx部署/nginx部署.md' },
          { text: 'nginx部署趟坑', link: '/项目部署篇/nginx部署趟坑/nginx部署趟坑.md' },
        ]
      },
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
