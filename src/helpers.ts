import type { ModuleInstance } from './vuexok'

declare var __DEV__: boolean

type States<M extends ModuleInstance<any>> = (keyof M['state'])[] | {
  [key: string]: (state: M['state'], getters: M['getters']) => any
}

type Getters<M extends ModuleInstance<any>> = (keyof M['getters'])[] | {
  [key: string]: keyof M['getters']
}

type GetArrayKeys<T extends unknown[], P = T[number]> = P extends string ? P : never;

type MappedState<M extends ModuleInstance<any>, S extends States<M>> = (
  S extends Array<string|symbol|number> ? {
    [X in GetArrayKeys<S>]: X extends keyof M['state'] ? () => () => M['state'][X] : never
  } : {
    [K in keyof S]: S[K] extends Function ? S[K] : never
  }
)

type MappedGetter<M extends ModuleInstance<any>, G extends Getters<M>> = (
  G extends Array<string|symbol|number> ? {
    [X in GetArrayKeys<G>]: X extends keyof M['getters'] ? () => () => M['getters'][X] : never
  }: {
    [K in keyof G]: G[K] extends keyof M['getters'] ? () => M['getters'][K] : never
  }
)

function isObject (obj:any) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Validate whether given map is valid or not
 * @param {*} map
 * @return {Boolean}
 */
function isValidMap(map:any): boolean {
  return Array.isArray(map) || isObject(map)
}

/**
 * Normalize the map
 * normalizeMap([1, 2, 3]) => [ { key: 1, val: 1 }, { key: 2, val: 2 }, { key: 3, val: 3 } ]
 * normalizeMap({a: 1, b: 2, c: 3}) => [ { key: 'a', val: 1 }, { key: 'b', val: 2 }, { key: 'c', val: 3 } ]
 * @param {Array|Object} map
 * @return {Object}
 */
function normalizeMap<S extends (string|symbol|number)[] | Record<(string|symbol|number), any>>(map:S) {
  if (!isValidMap(map)) {
    return []
  }

  return Array.isArray(map)
    ? map.map(key => ({ key, val: key }))
    : Object.keys(map).map(key => ({ key, val: map[key as S extends Record<any, any> ? keyof S : never] }))
}

export const mapState = <M extends ModuleInstance<any>, K extends States<M>, R = MappedState<M, K>>(module:M, states:K):R => {
  const res = {} as R
  if (__DEV__ && !isValidMap(states)) {
    console.error('[vuexok] mapState: mapper parameter must be either an Array or an Object')
  }

  normalizeMap(states).forEach(({ key, val }) => {
    // @ts-ignore
    res[key] = function mappedState() {
      const { state, getters } = module.state

      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    }
    // mark vuex getter for devtools
    // @ts-ignore
    res[key].vuex = true
  })

  return res
}

/**
 * Reduce the code which written in Vue.js for getting the getters
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} getters
 * @return {Object}
 */
 export const mapGetters = <M extends ModuleInstance<any>, G extends Getters<M>, R = MappedGetter<M, G>>(module:M, getters:G):R => {
  const res = {} as R

  if (__DEV__ && !isValidMap(getters)) {
    console.error('[vuexok] mapGetters: mapper parameter must be either an Array or an Object')
  }

  normalizeMap(getters).forEach(({ key, val }) => {
    // @ts-ignore
    res[key] = function mappedGetter () {
      if (__DEV__ && !(val as string|number|symbol in module.getters)) {
        console.error(`[vuexok] unknown getter: ${val as string}`)
        return
      }

      // @ts-ignore
      return module.getters[val]
    }
    // mark vuex getter for devtools
    // @ts-ignore
    res[key].vuex = true
  })

  return res
}
