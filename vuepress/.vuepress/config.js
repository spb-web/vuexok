module.exports = {
  base: '/vuexok/',
  head: [
    ['link', { rel: "apple-touch-icon", sizes: "180x180", href: "/favicons/apple-icon-180x180.png"}],
    ['link', { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicons/favicon-32x32.png"}],
    ['link', { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicons/favicon-16x16.png"}],
    ['link', { rel: "manifest", href: "/favicons/manifest.json"}],
    ['link', { rel: "mask-icon", href: "/favicons/safari-pinned-tab.svg", color: "#3a0839"}],
    ['link', { rel: "shortcut icon", href: "/favicons/favicon.ico"}],
    ['meta', { name: "msapplication-TileColor", content: "#3a0839"}],
    ['meta', { name: "msapplication-config", content: "/favicons/browserconfig.xml"}],
    ['meta', { name: "theme-color", content: "#3eaf7c"}],
  ],
  configureWebpack: {
    resolve: {
      alias: {
        '@alias': './public'
      }
    }
  },
  locales: {
    // The key is the path for the locale to be nested under.
    // As a special case, the default locale can use '/' as its path.
    '/': {
      lang: 'ru-RU', // this will be set as the lang attribute on <html>
      title: 'Vuexok',
      description: 'Упрощение работы с vuex, поддержка typescript',
      nav: [
        { text: 'Github', link: 'https://github.com/spb-web/vuexok' , ariaLabel: 'Github' }
      ],
    },
    '/en/': {
      lang: 'en-US',
      title: 'Vuexok',
      description: 'Vuexok',
      nav: [
        { text: 'Github', link: 'https://github.com/spb-web/vuexok' , ariaLabel: 'Github' }
      ],
    }
  },
  themeConfig: {
    sidebar: [
      {
        title: 'Introduction',   // required
        path: '/',      // optional, link of the title, which should be an absolute path and must exist
        collapsable: false, // optional, defaults to true
        sidebarDepth: -1,    // optional, defaults to 1
        children: [
          '/'
        ]
      },
      {
        title: 'Tooling',
        path: '/Tooling', 
        initialOpenGroupIndex: 1 // optional, defaults to 0, defines the index of initially opened subgroup
      },
      {
        title: 'Worker',
        path: '/Worker', 
        initialOpenGroupIndex: -1 // optional, defaults to 0, defines the index of initially opened subgroup
      },
      {
        title: 'No typescript',
        path: '/JsProjects', 
        initialOpenGroupIndex: -1 // optional, defaults to 0, defines the index of initially opened subgroup
      },
      {
        title: 'SSR',
        path: '/Ssr', 
        initialOpenGroupIndex: -1 // optional, defaults to 0, defines the index of initially opened subgroup
      },
    ],
    locales: {
      '/': {
        nav: [
          { text: 'Github', link: 'https://github.com/spb-web/vuexok' , ariaLabel: 'Github' }
        ],
      },
      '/en/': {
        nav: [
          { text: 'Github', link: 'https://github.com/spb-web/vuexok' , ariaLabel: 'Github' }
        ],
      }
    }
  }
}
