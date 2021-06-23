## Before
Store
``` ts{4}
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

## After

``` ts{4,12}
import { createModule } from 'vuexok'
import store from '@/store'

export const counterModule = createModule('counterModule', {
  namespaced: true,
  state: { ... },
  actions: { ... },
  mutations: { ... },
  getters: { ... },
})

counterModule.register(store)
```
