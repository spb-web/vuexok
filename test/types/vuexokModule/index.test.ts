// eslint-disable-next-line
import { createModule } from '../../../dist/vuexok'
import { Store } from 'vuex'

const store = new Store({
  state: {
    global: 'global',
  },
})

const module = createModule('moduleName', {
  state: {
    number: 1,
  },
  actions: {
    plus(injectee, payload: number) {
      injectee // $ExpectType ActionContext<{ number: number; }, unknown>
      module.mutations.plus(payload) // $ExpectType void
    },
    async plusAndReturnStr(injectee, payload: number) {
      const actionPromise = module.actions.plus(payload) // $ExpectType Promise<void>

      await actionPromise

      return injectee.state.number.toString()
    }
  },
  mutations: {
    plus(state, payload: number) {
      state.number += payload
      state.number // $ExpectType number
    },
    minus(state, payload: number) {
      state.number -= payload
      state.number // $ExpectType number
    },
  },
  getters: {
    x2(state) {
      state // $ExpectType { number: number; }

      return state.number * 2
    },
    fixed(state) {
      state // $ExpectType { number: number; }

      return state.number.toFixed(2)
    },
  }
})

// $ExpectType () => boolean
module.hasModule

// $ExpectType (store: Store<any>, moduleOptions?: ModuleOptions | undefined, throwErrorIfRegistered?: boolean | undefined) => void
module.register
// $ExpectType void
module.register(store)

// $ExpectType () => void
module.unregister

// $ExpectType number
module.state.number

// $ExpectType (payload: number) => Promise<void>
module.actions.plus

// $ExpectType (payload: number) => Promise<string>
module.actions.plusAndReturnStr

// $ExpectType (payload: number) => void
module.mutations.plus

// $ExpectType string
module.getters.fixed

// $ExpectType number
module.getters.x2

// $ExpectType Unwatch
const unwatch = module.watch((state, getters) => {
  // $ExpectType Readonly<{ number: number; }>
  state
  // $ExpectType ModuleGetters<{ x2(state: { number: number; }): number; fixed(state: { number: number; }): string; }>
  getters

  return state.number
}, (val) => {
  val // $ExpectType number
})

// $ExpectType void
unwatch()

const unsubscribe = module.subscribe((m, s) => {
  m // $ExpectType "plus" | "minus"
  s // $ExpectType Readonly<{ number: number; }>
})

unsubscribe // $ExpectType Unsubscribe
