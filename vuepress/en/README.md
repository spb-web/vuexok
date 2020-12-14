# Vuexok

vuexok is a small package for large projects. 

[![npm bundle size](https://img.shields.io/bundlephobia/minzip/vuexok?color=%233eaf7c&style=for-the-badge&logo=appveyor)](https://bundlephobia.com/result?p=vuexok)

::: tip
Vuexok does not replace the vuex api but extends it. Adds support for typescript types and makes it possible to use actions and mutations without explicitly using [commit](https://vuex.vuejs.org/guide/mutations.html) and [dispatch](https://vuex.vuejs.org/guide/actions.html#dispatching-actions), so migration in most cases will be quick and painless.
:::

## Install
### NPM
```
npm install vuexok --save
```

### Yarn
```
yarn add vuexok
```

## What vuexok gives
- No more constants needed for actions and mutations
- More convenient work with watchers
- Full support for typescript: tada:
- Easy migration from vuex. You don't have to rewrite everything
- Compatible with vuex 4 and vue 3: fire:
- Small size vuexok

## Using
::: warning
Note that vuexok creates dynamic modules. All modules will be registered after the store has been created using the [store.registerModule](https://vuex.vuejs.org/guide/modules.html#dynamic-module-registration) method
:::

### Module creation
Notice how the plus mutation is called from the increment action
``` ts{10}
import { createModule } from 'vuexok'
import store from '@/store'

export const counterModule = createModule(store, 'counterModule', {
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
})
```

### Using Vuexok Module in Vue Components
::: tip
Vuexok internally uses vuex. The main purpose of creating vuexok was not to create a new api, but to extend the current vuex api. Therefore, when migrating, you will not need to rewrite the component code.
:::

The state property in a module is reactive, just like [store.state](https://vuex.vuejs.org/guide/state.html#getting-vuex-state-into-vue-components), so to use the module state in Vue components you just need to return some of the module state in a [computed property](https://ru.vuejs.org/v2/guide/computed.html).

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

#### Class component

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

#### Calling actions and mutations
##### Actions
```ts
import { counterModule } from '@/store/modules/counterModule'

// Similar to
// store.dispatch('counterModule/increment')

counterModule.actions.increment().then(() => {
  console.log('increment called')
})
```
##### Mutations
```ts
import { counterModule } from '@/store/modules/counterModule'

// Similar to
// store.commit('counterModule/setNumber', 10)

counterModule.mutations.setNumber(10)
```

#### Watchers
Module watchers work the same way as [store.watch](https://vuex.vuejs.org/api/#watch). The only difference is that the state and getters of the module are passed as parameters of the getter function.

```ts
const unwatch = jwtModule.watch(
  (state, getters) => getters.jwt,
  (jwt) => console.log(`New token: ${jwt}`),
  { immediate: true },
)
```



If you have a question or need support using Vuexok, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, use the issues page.