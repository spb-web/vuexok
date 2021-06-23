# Tooling
Vuexok internally uses vuex. The main purpose of creating vuexok was not to create a new api, but to extend the current vuex api. Therefore, when migrating, you will not need to rewrite the component code.

## Module creation

::: warning
Please note that vuexok creates dynamic modules. All modules will be registered after the store has been created using the [store.registerModule](https://vuex.vuejs.org/guide/modules.html#dynamic-module-registration) method
:::

Notice how the plus mutation is called from the increment action
``` ts{11}
import { createModule } from 'vuexok'
import store from '@/store'

export const counterModule = createModule(
  'counterModule',
  {
    namespaced: true,
    state: {
      count: 0,
    },
    actions: {
      async increment() {
        counterModule.mutations.plus(1)
      },
    },
    mutations: {
      plus(state, payload:number) {
        state.count += payload
      },
      setNumber(state, payload:number) {
        state.count = payload
      },
    },
    getters: {
      x2(state) {
        return state.count * 2
      },
    },
  }
)

counterModule.register(store)
```

::: tip
So that several modules do not react to the same type of mutations / actions, it is recommended to create modules with their own namespace by specifying the [`namespaced: true`](https://vuex.vuejs.org/guide/modules.html#namespacing) option
:::

## Using Vuexok Module in Vue Components

The state property in a module is reactive, just like in [store.state] (https://vuex.vuejs.org/guide/state.html#getting-vuex-state-into-vue-components), so to use the state of the module in Vue components it is enough to simply return part of the module state in the [computed property] (https://v3.vuejs.org/guide/reactivity-computed-watchers.html).

```ts{1,6,7,8}
import { counterModule } from '@/store/modules/counterModule'

const Counter = Vue.extends({
  template: `<div>{{ count }}</div>`,
  computed: {
    count() {
      return counterModule.state.count // type number
    },
  },
})
```

### Vue Class Based Components

```ts{2,9,10,11}
import Vue from 'vue'
import { counterModule } from '@/store/modules/counterModule'
import Component from 'vue-class-component'

@Component({
  template: '<div>{{ count }}</div>'
})
export default class MyComponent extends Vue {
  private get count() {
    return counterModule.state.count // type number
  }
}
```

### Composition API

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

## Calling actions and mutations
## Actions
```ts
import { counterModule } from '@/store/modules/counterModule'

// Similar to
// store.dispatch('counterModule/increment').then(() => {
//   console.log('increment called')
// })

counterModule.actions.increment().then(() => {
  console.log('increment called')
})
```
## Mutations
```ts
import { counterModule } from '@/store/modules/counterModule'

// Similar to
// store.commit('counterModule/setNumber', 10)

counterModule.mutations.setNumber(10)
```

## Watch

Module watchers work the same way as [store.watch](https://vuex.vuejs.org/api/#watch). The only difference is that the state and getters of the module are passed as parameters of the getter function.

```ts
const unwatch = jwtModule.watch(
  (state, getters) => getters.jwt,
  (jwt) => console.log(`New token: ${jwt}`),
  { immediate: true },
)
```
