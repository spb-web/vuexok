## Before
Store
``` ts{2,4}
import { createModule } from 'vuexok'
import store from '@/store'

export const counterModule = createModule(store, 'counterModule', {
  namespaced: true,
  state: { ... },
  actions: { ... },
  mutations: { ... },
  getters: { ... },
})
```

Module
```ts{2,8}
import { computed, defineComponent } from '@vue/composition-api'
import { counterModule } from '@/store/modules/counterModule'

export default defineComponent({
  template: '<div>{{ count }}</div>',
  setup() {
    return {
      count: computed(() => counterModule.state.count)
    }
  },
})
```


## After

``` ts{3}
import { createModule } from 'vuexok'

export const counterModule = createModule('counterModule', {
  namespaced: true,
  state: { ... },
  actions: { ... },
  mutations: { ... },
  getters: { ... },
})
```

Module
```ts{2,7,8,11}
import { computed, defineComponent, useStore } from '@vue/composition-api'
import { counterModule } from '@/store/modules/counterModule'

export default defineComponent({
  template: '<div>{{ count }}</div>',
  setup() {
    const store = useStore()
    counterModule.register(store)

    return {
      count: computed(() => counterModule.state.count)
    }
  }
})
```