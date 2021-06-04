import type { Module, Store } from 'vuex'
import { createModule as originalCreateModule, ModuleInstance } from '../vuexok'

let store:Store<any>
let modulesQueue:AModule<any, any, any>[] = []

export const setStore = (nuxtStore:Store<any>) => {
  store = nuxtStore

  modulesQueue.forEach(moduleProxy => {
    moduleProxy.initModule(store)
  })

  modulesQueue = []
}

class AModule<S, R, M extends Module<S, R>> {
  path:string
  moduleRaw:M extends Module<S, R> ? M : Module<S, R>
  module?:ModuleInstance<M>
  
  public proxy = new Proxy(this, {
    get(target, key:keyof ModuleInstance<any>) {
      if (target.module) {
        return target.module[key]
      } else {
        throw new Error()
      }
    }
  }) as any as ModuleInstance<M extends Module<S, R> ? M : Module<S, R>>

  constructor(path:string, moduleRaw:M extends Module<S, R> ? M : Module<S, R>) {
    this.path = path
    this.moduleRaw = moduleRaw
  }

  public initModule(store:Store<any>) {
    this.module = originalCreateModule(
      store,
      this.path,
      this.moduleRaw,
      { preserveState: false },
    )
  }
}


export const createModule = <S, R, M extends Module<S, R>>(path:string, mod:M extends Module<S, R> ? M : Module<S, R>):ModuleInstance<M> => {
  if (store) {
    return originalCreateModule(store, path, mod, { preserveState: process.browser })
  } else {
    const aModule = new AModule(path, mod)

    modulesQueue.push(aModule)

    return aModule.proxy
  }
}