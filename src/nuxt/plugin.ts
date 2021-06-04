import type { Plugin } from '@nuxt/types'
// @ts-ignore
import { setStore } from '<%= options.nuxtVuexok %>'

const plugin:Plugin = (context) => {
  setStore(context.store)
}

export default plugin

