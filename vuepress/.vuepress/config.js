module.exports = {
  base: '/vuexok',
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