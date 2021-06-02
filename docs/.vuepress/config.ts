import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'
import { path } from '@vuepress/utils'

export default defineUserConfig<DefaultThemeOptions>({
  lang: 'en-US',
  title: '2D Engine',
  description: 'The official documentation for the BIMData.io 2D Engine.',

  clientAppEnhanceFiles: path.resolve(__dirname, './components/index.ts'),

  themeConfig: {
    logo: '/assets/img/documentation.svg',

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