import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'
import { path } from '@vuepress/utils'

export default defineUserConfig<DefaultThemeOptions>({
  lang: 'en-US',
  title: '2D Engine',
  description: 'The official documentation for the BIMData.io 2D Engine.',

  base: "/",

  head: [
    ['link', { rel: 'icon', href: '/assets/img/favicon.svg', type: "image/svg+xml" }],
  ],

  clientAppEnhanceFiles: path.resolve(__dirname, './components/index.ts'),

  themeConfig: {
    logo: '/assets/img/documentation.svg',
    repo: "bimdata/2d-engine-documentation",

    navbar: [
      {
        text: 'Guide',
        link: '/guide/',
      },
      {
        text: 'Reference',
        link: '/reference/',
      },
    ],
  },
})