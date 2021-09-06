import type { WatchOptions } from 'vue/types/umd'
import type { 
  Module,
  Store,
  ModuleOptions,
  ActionTree,
  MutationTree,
  Mutation,
  ActionObject,
  GetterTree,
  Action,
} from 'vuex/types/index'
import type { Emitter, Handler as MittHandler } from 'mitt'
import mitt from 'mitt'

type NonUndefined<A> = A extends undefined ? {} : A

export type ValuesType<
  T extends Record<any, any>
> = T extends object ? T[keyof T] : never;

export type ActionOrMutationPayload<
  T extends (injectee:any, ...payload: any) => any
> = (
  T extends (injectee:any, ...payload: infer P) => any
    ? P
    : never
)

export type ActionHandler<VuexAction extends Action<any, any>> = (
  VuexAction extends ActionObject<any, any>
    ? VuexAction['handler']
    : VuexAction
)

export type ModuleActionReturnType<
  VuexAction extends Action<any, any>
> = (
  ReturnType<ActionHandler<VuexAction>> extends Promise<any>
    ? ReturnType<ActionHandler<VuexAction>>
    : Promise<ReturnType<ActionHandler<VuexAction>>>
)

export type ModuleActions<A extends ActionTree<any, any>> = {
  readonly [K in keyof A]: (
    ...payload:ActionOrMutationPayload<ActionHandler<A[K]>>
  ) => (
    ModuleActionReturnType<A[K]>
  )
}

export type ModuleMutations<A extends MutationTree<any>> = {
  readonly [K in keyof A]: (
    NonUndefined<A[K]> extends Mutation<any>
      ? (
        (
          ...payload:ActionOrMutationPayload<A[K]>
        ) => ReturnType<A[K]>
      )
      : unknown
  )
}

export type ModuleGetters<A extends GetterTree<any, any>> = {
  readonly [K in keyof A]: ReturnType<A[K]>
}

export type ModuleSubmodules<
  M extends Record<string, any> | undefined
> = {
  readonly [K in keyof M]: ModuleInstance<M[K]>
}

export type ModuleState<
  M extends (
    Record<string, any> | (() => Record<string, any>) | undefined
  )
> = Readonly<M extends (...p: any[]) => any ? ReturnType<M> : M>

type MutationsPayloads<
  A extends MutationTree<any>,
> = {
  readonly [K in keyof A]: {
    type: K extends string ? K : any,
    payload: NonUndefined<A[K]> extends Mutation<any>
      ? ActionOrMutationPayload<A[K]>[0]
      : unknown
  }
}

export type MutationPayload<M extends Module<any, any>, Mutations = MutationsPayloads<NonUndefined<M['mutations']>>> = (
  Mutations extends object ? ValuesType<Mutations> : any
)

export type Unwatch = () => void
export type Subscribe<M extends Module<any, any>> = (
  handle:(
    mutation: MutationPayload<M>,
    state: ModuleState<M['state']>,
  ) => any
) => Unsubscribe
export type Unsubscribe = () => void

export type ModuleEvents = {
  registered: undefined,
  unregistered: undefined,
}

export const modules:Map<
  string,
  ModuleInstance<Module<any, any>>
> = new Map()

export interface ModuleInstance<M extends Module<any, any>> {
  $store: Store<any>|undefined
  readonly $events: Emitter<ModuleEvents>
  readonly state: ModuleState<M['state']>,
  readonly actions: ModuleActions<NonUndefined<M['actions']>>,
  readonly mutations: ModuleMutations<NonUndefined<M['mutations']>>,
  readonly getters: ModuleGetters<NonUndefined<M['getters']>>,
  readonly modules: ModuleSubmodules<M['modules']>,
  /**
   * Reactively watch fn's return value, and call the callback when
   * the value changes. fn receives the store's state as the first
   * argument, and getters as the second argument. Accepts an
   * optional options object that takes the same options as Vue's
   * vm.$watch method (opens new window).
   *
   * To stop watching, call the returned unwatch function.
   */
  readonly watch: <T extends (
    state:ModuleState<M['state']>,
    getters:ModuleGetters<NonUndefined<M['getters']>>
  ) => any>(
    getter: T,
    callback: (
      value: ReturnType<T>,
      oldValue: ReturnType<T>,
    ) => void,
    options?: WatchOptions
  ) => Unwatch

  readonly subscribe: Subscribe<M>
  /**
   * You may check if the module is already registered to the store
   * or not via hasModule method.
   */
  readonly hasModule: () => boolean,
  /**
   * You can remove a registered module with unregister method.
   */
  readonly unregister: () => void,
  /**
   * @param store
   * @param moduleOptions see https://vuex.vuejs.org/guide/modules.html#dynamic-module-registration
   * @param throwErrorIfRegistered throw an error if the module is already registered
   */
  readonly register: (store:Store<any>, moduleOptions?: ModuleOptions, throwErrorIfRegistered?:boolean) => void,

  on<Key extends keyof ModuleEvents>(type: Key, handler: MittHandler<ModuleEvents[Key]>): void;
  once<Key extends keyof ModuleEvents>(type: Key, handler: MittHandler<ModuleEvents[Key]>): void;
  off<Key extends keyof ModuleEvents>(type: Key, handler?: MittHandler<ModuleEvents[Key]>): void;

  readonly path: string,
}

const helperReduce = <
  P extends Record<string, any>,
  I,
>(
  payload:P | undefined,
  getter:(key: string, value:any) => I,
) => {
  if (payload) {
    return new Proxy(payload, {
      get(target, name:string) {
        if (Object.prototype.hasOwnProperty.call(target, name)) {
          return getter(name, payload[name as keyof P])
        }
      }
    })
  }
}

const getStore = (module:ModuleInstance<any>) => {
  const { $store } = module

  if (!$store) {
    throw new Error(`Module ${module.path} not registered. Use module.register(store)\nsee https://spb-web.github.io/vuexok/MigrateTo1.x.x.html`)
  }

  return $store
}

const initSubModules = (module: ModuleInstance<Module<any, any>>, store:Store<any>) => {
  const { modules } = module

  if (modules) {
    Object.values(modules).forEach((subModule) => {
      subModule.$store = store
      subModule.$events.emit('registered')

      initSubModules(subModule, store)
    })
  }
}

/**
 * @example
 * const module = createModule('path', {
 *   namespaced: true,
 *   state: () => ({
 *     count: 1,
 *   }),
 *   mutations: {
 *     increment(state) {
 *       state.count++
 *     }
 *   },
 * })
 * 
 * module.once('registered', () => {
 *   setTimeout(() => {
 *     module.mutations.increment()
 *   })
 * })
 * 
 * module.register(store)
 * 
 * @param path 
 * @param moduleRaw 
 */
export const createModule = <
  S, R, M extends Module<S, R>
>(
  path: string,
  moduleRaw: M extends Module<S, R> ? M : Module<S, R>,
) => {
  const { namespaced } = moduleRaw
  const pathPrefix = namespaced ? path + '/' : ''
  const mutationsTypes:string[] = Object
    .keys(moduleRaw.mutations ?? {})
    .map(mutationType => `${pathPrefix}${mutationType}`)

  const module:ModuleInstance<M> = {
    $events: mitt(),
    $store: undefined,

    state: new Proxy({} as ModuleState<M['state']>, {
      get(target, name) {
        return getStore(module).state[path][name]
      }
    }),

    actions: helperReduce(moduleRaw.actions, (key) => {
      return (payload:any) => getStore(module).dispatch(
        `${pathPrefix}${key}`,
        payload,
      )
    }) as any as ModuleActions<NonUndefined<M['actions']>>,

    mutations: helperReduce(moduleRaw.mutations, (key) => {
      return (payload:any) => getStore(module).commit(
        `${pathPrefix}${key}`,
        payload,
      )
    }) as ModuleMutations<NonUndefined<M['mutations']>>,

    getters: helperReduce(moduleRaw.getters, (key) => {
      return getStore(module).getters[`${pathPrefix}${key}`]
    }) as ModuleGetters<NonUndefined<M['getters']>>,

    modules: helperReduce(moduleRaw.modules, (key, submodule) => {
      return createModule(
        `${pathPrefix}${key}`,
        submodule,
      )
    }) as any as ModuleSubmodules<M['modules']>,

    watch: (
      getter,
      callback,
      options
    ) => {
      return getStore(module).watch(
        () => getter(module.state, module.getters),
        callback,
        options,
      )
    },
    subscribe(handle) {
      return getStore(module).subscribe((mutationPayload, state) => {
        if (mutationsTypes.includes(mutationPayload.type)) {
          const payload = {
            type: (namespaced ? mutationPayload.type.substr(pathPrefix.length) : mutationPayload),
            payload: mutationPayload.payload,
          } as MutationPayload<M>

          handle(payload, state)
        }
      })
    },
    hasModule() {
      return !!module.$store && module.$store.hasModule(path)
    },
    unregister() {
      getStore(module).unregisterModule(path)
      module.$store = undefined

      this.$events.emit('unregistered')
    },
    register(store, moduleOptions, throwErrorIfRegistered = false) {
      if (this.hasModule()) {
        if (throwErrorIfRegistered) {
          throw new Error(`Module "${this.path}" already registered`)
        }
      } else {
        module.$store = store
  
        store.registerModule(
          path, 
          moduleRaw,
          moduleOptions,
        )

        initSubModules(this, store)

        this.$events.emit('registered')
      }
    },
    on(type, handler) {
      this.$events.on(type, handler)
    },
    once(type, handler) {
      const offHandler = () => {
        this.$events.off(type, handler)
        this.$events.off(type, offHandler)
      }

      this.$events.on(type, handler)
      this.$events.on(type, offHandler)
    },
    off(type, handler) {
      this.$events.off(type, handler)
    },
    path,
  }

  modules.set(path, module)

  return module
}
