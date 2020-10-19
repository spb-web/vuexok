import type { 
  Module, 
  Store,
  ModuleOptions, 
  ActionTree, 
  MutationTree, 
  Mutation, 
  ActionObject, 
  GetterTree,
  Action
} from 'vuex/types/index'

type NonUndefined<A> = A extends undefined ? {} : A;

export type ActionMutationPayload<T extends (i:any, ...args: any) => any> = T extends (i:any, ...args: infer P) => any ? P : never;

export type ActionHandler<A extends Action<any, any>> = A extends ActionObject<any, any> ? A['handler'] : A

export type ModuleActions<A extends ActionTree<any, any>> = {
  readonly [K in keyof A]: (this: ThisType<Required<A>[K]>, ...payload:ActionMutationPayload<ActionHandler<Required<A>[K]>>) => (
    ReturnType<ActionHandler<Required<A>[K]>>
  )
}

export type ModuleMutations<A extends MutationTree<any>> = {
  readonly [K in keyof A]: NonUndefined<A[K]> extends Mutation<any> 
    ? (this: ThisType<A[K]>, ...payload:ActionMutationPayload<A[K]>) => (
      ReturnType<A[K]>
    )
    : unknown
}

export type ModuleGetters<A extends GetterTree<any, any>> = {
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

export type ModuleInstance<M extends Module<any, any>> = {
  state: ModuleState<M['state']>,
  actions: ModuleActions<NonUndefined<M['actions']>>,
  mutations: ModuleMutations<NonUndefined<M['mutations']>>,
  getters: ModuleGetters<NonUndefined<M['getters']>>,
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

const getKeyPath = (path:string, key:string, namespaced?: boolean) => {
  return namespaced ? `${path}/${key}` : key
}

const buildModuleObject = <
  S, R, M extends Module<S, R>
>(
  store:Store<R>,
  path: string,
  moduleRaw:M extends Module<S, R> ? M : Module<S, R>,
) => {
  const { namespaced } = moduleRaw

  const module:ModuleInstance<M> = {
    state: halperReduce(moduleRaw.state, (key) => {
      // @ts-ignore
      return store.state[path][key]
    }) as ModuleState<M['state']>,

    actions: halperReduce(moduleRaw.actions, (key) => {
      return (payload:any) => store.dispatch(getKeyPath(path, key, true), payload)
    }) as any as ModuleActions<NonUndefined<M['actions']>>,

    mutations: halperReduce(moduleRaw.mutations, (key) => {
      return (payload:any) => store.commit(getKeyPath(path, key, namespaced), payload)
    }) as ModuleMutations<NonUndefined<M['mutations']>>,

    getters: halperReduce(moduleRaw.getters, (key) => {
      return store.getters[getKeyPath(path, key, namespaced)]
    }) as ModuleGetters<NonUndefined<M['getters']>>,

    modules: halperReduce(moduleRaw.modules, (key, submodule) => {
      return buildModuleObject(store, getKeyPath(path, key, true), submodule)
    }) as ModuleSubmodules<M['modules']>
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

  const module = buildModuleObject(store, path, moduleRaw)

  return module
}
