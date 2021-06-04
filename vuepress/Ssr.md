## Vuexok Nuxt Module

nuxt.config.js
```js
{
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    'vuexok/dist/vuexokModule.ts',
  ],
}
```

```js
import { createModule } from 'vuexok/dist/nuxt/vuexokCreateModule'

const createDefaultState = () => ({
  count: 0,
})

export const counterModule = vuexokCreateModule(
  'counterModule',
  {
    namespaced: true,
    state: createDefaultState,
  },
}
```