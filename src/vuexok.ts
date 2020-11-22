import { WatchOptions } from 'vue/types/umd'
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

type NonUndefined<A> = A extends undefined ? {} : A;

export type ActionOrMutationPayload<
  T extends (injectee:any, ...payload: any) => any
> = (
  T extends (injectee:any, ...payload: infer P) => any
    ? P
    : never
)

export type ActionHandler<A extends Action<any, any>> = (
  A extends ActionObject<any, any>
    ? A['handler']
    : A
)

export type ModuleActions<A extends ActionTree<any, any>> = {
  readonly [K in keyof A]: (
    this: ThisType<A[K]>,
    ...payload:ActionOrMutationPayload<ActionHandler<A[K]>>
  ) => (
    ReturnType<ActionHandler<A[K]>>
  )
}

export type ModuleMutations<A extends MutationTree<any>> = {
  readonly [K in keyof A]: (
    NonUndefined<A[K]> extends Mutation<any> 
      ? (
          this: ThisType<A[K]>,
          ...payload:ActionOrMutationPayload<A[K]>
        ) => ReturnType<A[K]>
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

export type Unwatch = () => void

export interface ModuleInstance<M extends Module<any, any>> {
  state: ModuleState<M['state']>,
  actions: ModuleActions<NonUndefined<M['actions']>>,
  mutations: ModuleMutations<NonUndefined<M['mutations']>>,
  getters: ModuleGetters<NonUndefined<M['getters']>>,
  modules: ModuleSubmodules<M['modules']>,
  watch: <T extends (
    state:ModuleState<M['state']>,
    getters:ModuleGetters<NonUndefined<M['getters']>>
  ) => any>(
    getter: T,
    callback: (value: ReturnType<T>, oldValue: ReturnType<T>) => void,
    options?: WatchOptions
  ) => Unwatch
}

const helperReduce = <
  P extends Record<string, any>,
  I,
>(
  payload:P | undefined,
  getter:(key: string, value:any) => I
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

const getKeyPath = (
  path:string,
  key:string,
  namespaced?: boolean,
) => {
  return namespaced ? path + '/' + key : key
}

const buildModuleObject = <
  S, R, M extends Module<S, R>
>(
  store:Store<R>,
  path: string,
  moduleRaw: M,
) => {
  const { namespaced } = moduleRaw

  const module:ModuleInstance<M> = {
    state: new Proxy({} as ModuleState<M['state']>, {
      get(target, name) {
        // @ts-ignore
        return store.state[path][name]
      }
    }),

    actions: helperReduce(moduleRaw.actions, (key) => {
      return (payload:any) => store.dispatch(
        getKeyPath(path, key, namespaced),
        payload,
      )
    }) as any as ModuleActions<NonUndefined<M['actions']>>,

    mutations: helperReduce(moduleRaw.mutations, (key) => {
      return (payload:any) => store.commit(
        getKeyPath(path, key, namespaced),
        payload,
      )
    }) as ModuleMutations<NonUndefined<M['mutations']>>,

    getters: helperReduce(moduleRaw.getters, (key) => {
      return store.getters[getKeyPath(path, key, namespaced)]
    }) as ModuleGetters<NonUndefined<M['getters']>>,

    modules: helperReduce(moduleRaw.modules, (key, submodule) => {
      return buildModuleObject(
        store,
        getKeyPath(path, key, true),
        submodule,
      )
    }) as any as ModuleSubmodules<M['modules']>,

    watch: (
      getter,
      callback,
      options
    ) => {
      return store.watch(
        () => getter(module.state, module.getters),
        callback,
        options,
      )
    }
  }

  return module
}

export const createModule = <
  S, R, M extends Module<S, R>
>(
  store:Store<R>,
  path: string,
  moduleRaw: M extends Module<S, R> ? M : Module<S, R>,
  moduleOptions?: ModuleOptions
) => {
  store.registerModule(
    path, 
    moduleRaw,
    moduleOptions,
  )

  return buildModuleObject<
    S,
    R,
    typeof moduleRaw & M
    // @ts-ignore
  >(store, path, moduleRaw)
}
