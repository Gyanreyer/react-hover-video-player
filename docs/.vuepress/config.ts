import { defineUserConfig } from 'vuepress';
import type { DefaultThemeOptions } from 'vuepress';

export default defineUserConfig<DefaultThemeOptions>({
  description:
    'A React component for setting up a video that plays on hover. Supports both desktop mouse events and mobile touch events, and provides an easy interface for adding thumbnails and loading states.',
  head: [
    // Set the favicon to the film strip emoji
    [
      'link',
      {
        rel: 'icon',
        href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎞️</text></svg>',
      },
    ],
    // Add GA tags to the <head> of the page
    [
      'script',
      {
        async: true,
        src: 'https://www.googletagmanager.com/gtag/js?id=G-D7PD421E1W',
      },
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-D7PD421E1W');`,
    ],
  ],
  themeConfig: {
    docsDir: 'docs',
    navbar: [
      { text: 'Home', link: '/' },
      { text: 'Contributing', link: '/CONTRIBUTING.md' },
    ],
    repo: 'gyanreyer/react-hover-video-player',
    sidebar: 'auto',
    sidebarDepth: 2,
  },
  markdown: {
    links: {
      externalIcon: false,
    },
  },
  plugins: ['@vuepress/plugin-search'],
});
