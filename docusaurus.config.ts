import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'PISM开源',
  tagline: 'Plan Implement Simplify Master',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://pism.com.cn',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'pism-oss', // Usually your GitHub org/user name.
  projectName: 'pism', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
  },

  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'google-adsense-account',
        content: 'ca-pub-7006111376650963'
      }
    },
    {
      tagName: 'script',
      attributes: {
        async: "async",
        src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7006111376650963',
        crossorigin: 'anonymous'
      }
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'baidu_union_verify',
        content: 'a3328efdd27229dc4fef6baf78bdd6a8'
      }
    }
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/pism-oss/pism/blob/main',
          showLastUpdateTime: true,
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/pism-oss/pism/blob/main',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/pism.svg',
    navbar: {
      title: 'PISM开源',
      logo: {
        alt: 'PISM Logo',
        src: 'img/pism.svg',
      },
      items: [{
        type: "docSidebar",
        position: 'left',
        sidebarId: 'tools',
        label: '在线工具'
      }, {
        type: 'localeDropdown',
        position: 'left',
      },
      ],
    },
    footer: {
      style: 'light',
      copyright: `© ${new Date().getFullYear()} All Rights Reserved.
        <br/>
        <a href="https://beian.miit.gov.cn/">蜀ICP备19017495号-1</a>
`,
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.github,
    },
  } satisfies Preset.ThemeConfig,

  plugins: [
    function tailwindcssPlugin(context, options) {
      return {
        name: 'docusaurus-tailwindcss',
        configurePostCss(postcssOptions) {
          postcssOptions.plugins.push(require('@tailwindcss/postcss'));
          postcssOptions.plugins.push(require('autoprefixer'));
          return postcssOptions;
        }
      };
    }
  ]
};

export default config;
