
import { resolve, extname } from 'upath'
import type { Module, NuxtOptions } from '@nuxt/types'

/**
 * @private
 */
const nuxtVuexokModule:Module = function() {
  const nuxtOptions = this.nuxt.options as NuxtOptions

  if (!nuxtOptions.store) {
    console.warn('You do not have a store defined.')
  }

  this.addPlugin({
    src: resolve(__dirname, `./plugin${extname(__filename)}`),
    fileName: 'nuxt-vuexok.js',
    options: {
      nuxtVuexok: 'vuexok/dist/nuxt/vuexokCreateModule',
    },
  })
}

export default nuxtVuexokModule
