## Nuxt ssr

Module:
```ts
import { createModule } from 'vuexok'

const createDefaultState = () => ({
  count: Math.ceil(Math.random() * 100),
})

export const counterModule = vuexokCreateModule(
  'counterModule',
  {
    namespaced: true,
    state: createDefaultState,
    mutations: {
      plus(state, payload:number) {
        state.count += payload
      },
    },
  },
})

if (process.client) {
  counterModule.once('registered', () => {
    setTimeout(() => {
      counterModule.mutations.plus(1)
    }, 1000)
  })
}
```

Component:
```ts
import { computed, defineComponent, useStore } from '@nuxtjs/composition-api'
import { counterModule } from 'vuexokModules/counterModule'

export default defineComponent({
  setup() {
    const store = useStore()
    counterModule.register(store)

    return {
      count: computed(() => counterModule.state.count)
    }
  }
})
```
