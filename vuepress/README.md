# Vuex на максималках вместе с Vuexok

vuexok маленький пакет для больших проектов. 

![npm bundle size](https://img.shields.io/bundlephobia/minzip/vuexok?color=%233eaf7c&style=for-the-badge&logo=appveyor)

::: tip
Vuexok не заменяет api vuex, а расширяет его, добавляя поддержку типов typescript и дает возможность использовать экшены и мутации без явного использования [commit](https://vuex.vuejs.org/guide/mutations.html) и [dispatch](https://vuex.vuejs.org/guide/actions.html#dispatching-actions), поэтому миграция в большинстве случает пройдет быстро и безболезненно.
:::

## Установка
### NMP
```
npm install vuexok --save
```

### Yarn
```
yarn add vuexok
```

## Что даст vuexok
- Больше не нужны константы для экшенов и мутаций
- Более удобная работа с вотчерами
- Полная поддержка typescript :tada:
- Простая миграция с vuex: вам не придется всё переписывать
- Совместимо с vuex 4 и vue 3 :fire:
- Маленький размер vuexok

## Применение
::: warning
Обратите внимание, что vuexok создает динамические модули. Все модули будут зарегистрированы уже после того, как хранилище было создано, используя метод [store.registerModule](https://vuex.vuejs.org/guide/modules.html#dynamic-module-registration)
:::

### Создание модуля
Обратите внимание, как вызывается мутация plus из экшена increment
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

### Использование модуля Vuexok в компонентах Vue
::: tip
Vuexok внутри использует vuex. Основной целью создания являлось не создания нового api, а расширение текущего api vuex, поэтому при миграции у вас не будет необходимости переписывать код компонентов.
:::

Свойство state в модуле реактивно, как и в [store.state](https://vuex.vuejs.org/guide/state.html#getting-vuex-state-into-vue-components), так что чтобы использовать состояние модуля в компонентах Vue достаточно просто вернуть часть состояния модуля в [вычисляемом свойстве](https://ru.vuejs.org/v2/guide/computed.html).

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

#### Компоненты Vue на основе классов

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

#### Вызов экшенов и мутаций
##### Экшены
```ts
import { counterModule } from '@/store/modules/counterModule'

// Аналогично вызову
// store.dispatch('counterModule/increment')

counterModule.actions.increment().then(() => {
  console.log('increment called')
})
```
##### Мутации
```ts
import { counterModule } from '@/store/modules/counterModule'

// Аналогично вызову
// store.commit('counterModule/setNumber', 10)

counterModule.mutations.setNumber(10)
```

#### Вотчеры

Вотчеры модулей работают также как [store.watch](https://vuex.vuejs.org/api/#watch). Единственная разница заключается в том , что в качестве параметров функции-гетера передаются стейт и гетеры модуля

```ts
const unwatch = jwtModule.watch(
  (state, getters) => getters.jwt,
  (jwt) => console.log(`New token: ${jwt}`),
  { immediate: true },
)
```