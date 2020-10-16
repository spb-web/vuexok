import type { 
  Module, 
  Store,
  ModuleOptions, 
  ActionTree, 
  MutationTree, 
  Mutation, 
  ActionObject, 
  GetterTree,
} from 'vuex/types/index'

export type NonUndefined<A> = A extends undefined ? never : A;

export type ModuleActions<A extends ActionTree<any, any> | undefined, > = {
  readonly [K in keyof A]: NonUndefined<A[K]> extends ActionObject<any, any> 
    ? unknown
    // @ts-ignore
    : (this: ThisType<A[K]>, payload:Parameters<A[K]>[1]) => (
      // @ts-ignore
      ReturnType<A[K]>
    )
}

export type ModuleMutations<A extends MutationTree<any> | undefined> = {
  readonly [K in keyof A]: NonUndefined<A[K]> extends Mutation<any> 
    // @ts-ignore
    ? (this: ThisType<A[K]>, payload:Parameters<A[K]>[1]) => (
      // @ts-ignore
      ReturnType<A[K]>
    )
    : unknown
}

export type ModuleGetters<A extends GetterTree<any, any> | undefined> = {
  // @ts-ignore
  readonly [K in keyof A]: ReturnType<A[K]>
}

export type ModuleSubmodules<M extends Record<string, any> | undefined> = {
  readonly [K in keyof M]: ModuleInstance<M[K]>
}

export type ModuleState<
  M extends (
    Record<string, any> | (() => Record<string, any>) | undefined
  )
> = Readonly<M extends (...p: any[]) => any ? ReturnType<M> : M>

export type ModuleInstance<M extends ModuleRaw<any, any>> = {
  state: ModuleState<M['state']>,
  actions: ModuleActions<M['actions']>,
  mutations: ModuleMutations<M['mutations']>,
  getters: ModuleGetters<M['getters']>,
  modules: ModuleSubmodules<M['modules']>
}

export type ModuleRaw<S, R> = Omit<Module<S, R>, 'namespaced'>

const halperReduce = <
  P extends Record<string, any>,
  I,
>(
  payload:P | undefined,
  reducer:(key: string, value:any) => I
) => {
  if (payload) {
    return Object.keys(payload).reduce((acc, key) => {
      acc[key as keyof P] = reducer(key, payload[key as keyof P])

      return acc
    }, {} as Record<keyof P, I>)
  }
}

const buildModuleObject = <
  S, R, M extends ModuleRaw<S, R>
>(
  store:Store<R>,
  name: string,
  moduleRaw:M extends ModuleRaw<S, R> ? M : ModuleRaw<S, R>,
) => {
  const module:ModuleInstance<M> = {
    state: halperReduce(moduleRaw.state, (key) => {
      // @ts-ignore
      return store.state[name][key]
    }) as ModuleState<M['state']>,

    actions: halperReduce(moduleRaw.actions, (key) => {
      return (payload:any) => store.dispatch(`${name}/${key}`, payload)
    }) as ModuleActions<M['actions']>,

    mutations: halperReduce(moduleRaw.mutations, (key) => {
      return (payload:any) => store.commit(`${name}/${key}`, payload)
    }) as ModuleMutations<M['mutations']>,

    getters: halperReduce(moduleRaw.getters, (key) => {
      return store.getters[`${name}/${key}`]
    }) as ModuleGetters<M['getters']>,

    modules: halperReduce(moduleRaw.modules, (key, submodule) => {
      return buildModuleObject(store, `${name}/${key}`, submodule)
    }) as ModuleSubmodules<M['modules']>
  }

  return module
}

export const createModule = <
  S, R, M extends ModuleRaw<S, R>
>(
  store:Store<R>,
  path: string,
  moduleRaw: M extends ModuleRaw<S, R> ? M : ModuleRaw<S, R>,
  moduleOptions?: ModuleOptions
) => {
  store.registerModule(
    path, 
    Object.assign(
      {},
      moduleRaw,
      { namespaced: true },
    ),
    moduleOptions,
  )

  const module = buildModuleObject(store, path, moduleRaw)

  return module
}
