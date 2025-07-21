import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  projectName: 'Promise Saga',
  organizationName: 'Promise Saga',
  title: 'Promise Saga',
  tagline: 'A strongly typed side effects orchestrator',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  baseUrl: '/',
  url: 'https://promise-saga.github.io',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: '../docs',
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/promise-saga/promise-saga.github.io/tree/main/website',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      {
        hashed: true,
        language: ['en', 'zh'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/logo.png',
    metadata: [
      {
        name: 'google-site-verification',
        content: 'v2XdRqliuvY-5IqM1xEEYL1w-ezkUTa_rxEgj1nsed4',
      },
    ],
    navbar: {
      title: 'Promise Saga',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: '/docs/basics',
          label: 'Basics',
          position: 'left',
        },
        {
          to: '/docs/examples',
          label: 'Examples',
          position: 'left',
        },
        {
          to: '/docs/api',
          label: 'API',
          position: 'left',
        },
        {
          href: 'https://github.com/promise-saga/promise-saga.github.io',
          position: 'right',
          label: 'GitHub',
        },
        {
          href: 'https://www.npmjs.com/org/promise-saga',
          position: 'right',
          label: 'npm',
        },
      ],
    },
    footer: {
      copyright: `
        <div style="display: flex; flex-direction: column; gap: 3px; align-items: center; justify-content: center;">
            <div>Copyright © ${new Date().getFullYear()} Andrew Khantulin. Built with Docusaurus.</div>
            <div>Any feedback is welcome at <a href="mailto:promisesaga.dev@gmail.com">promisesaga.dev@gmail.com</a></div>
            <a style="color: inherit; display: flex; align-items: center; gap: 8px;" href="https://ko-fi.com/andrewkhantulin" target="_blank">
                <img height="15" style="border: 0px; height: 15px;" src="https://storage.ko-fi.com/cdn/logomarkLogo.png" border="0" alt="Support me at Ko-fi" /> Support me at Ko-fi
            </a>
        </div> 
      `,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    announcementBar: {
      id: 'stop_war_in_ukraine',
      content: [
        '<a target="_blank" style="font-size: 16px; font-weight: bold; line-height: 26px; text-decoration: none; text-transform: uppercase;" href="https://supportukrainenow.org">',
        '🇺🇦 Support Ukraine 🇺🇦',
        '</a>',
      ].join(''),
      backgroundColor: 'var(--ifm-color-default-bg)',
      textColor: 'var(--ifm-color-default-text)',
      isCloseable: false,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
