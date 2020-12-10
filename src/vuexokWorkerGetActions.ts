import type { Module } from 'vuex'
import type { ModuleInstance } from './vuexok'

const ctx: Worker = self as any

export type WorkerModuleActions<
  M extends ModuleInstance<Module<any, any>>
> = M['actions']

export const vuexokWorkerGetActions = <
  M extends ModuleInstance<Module<any, any>>
>(path:string):WorkerModuleActions<M> => {
  return new Proxy(
    {},
    {
      get: (target, action) => {
        return (payload:any) => new Promise((resolve, reject) => {
          const callbackId = Math.random().toString(32)
          const removeListener = () => {
            ctx.removeEventListener('message', callbackListener)
          }
          const callbackListener = (event:MessageEvent) => {
            switch (event.data.type) {
              case 'vuexok:action:resolve':
                removeListener()
                resolve(event.data.result)
                break;
              case 'vuexok:action:reject':
                removeListener()
                reject(event.data.result)
                break;
            }
          }

          ctx.addEventListener(
            'message',
            callbackListener,
          )

          ctx.postMessage({
            type: 'vuexok:action',
            path,
            action,
            payload,
            callbackId,
          })
        })
      }
    },
  )
}
