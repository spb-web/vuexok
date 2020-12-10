import { createModule } from '../../../src/vuexok'
import { store } from './store'

export const countModule = createModule(
  store,
  'coutModule',
  {
    state: () => ({
      data: 0,
    }),
    actions: {
      async increment() {
        countModule.mutations.plus(1)
      },
      async plus(injectee, payload:number) {
        countModule.mutations.plus(payload)
      },
    },
    mutations: {
      plus(state, payload) {
        state.data += payload
      },
    },
  },
)
