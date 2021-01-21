import type { Module } from 'vuex'
import type { ModuleInstance } from './vuexok'
import type {
  VuexokActionRejectEvent,
  VuexokActionResolveEvent,
} from './vuexokWorkerWrapper'

export type VuexokActionCallEvent = {
  type: 'vuexok:action',
  path: string,
  action: string,
  payload: any,
  vuexokCallbackId: string,
}

export type WorkerModuleActions<
  M extends ModuleInstance<Module<any, any>>
> = M['actions']

const ctx: Worker = self as any

export const vuexokWorkerGetActions = <
  M extends ModuleInstance<Module<any, any>>
>(path:string):WorkerModuleActions<M> => {
  return new Proxy(
    {},
    {
      get: (target, action:string) => {
        return (payload:any) => new Promise((resolve, reject) => {
          const vuexokCallbackId = Math.random().toString(32)
          const removeListener = () => {
            ctx.removeEventListener('message', callbackListener)
          }
          const callbackListener = (
            event:MessageEvent<
              VuexokActionResolveEvent|VuexokActionRejectEvent
            >
          ) => {
            const { data } = event
            if (vuexokCallbackId !== data.vuexokCallbackId) {
              return
            }

            switch (data.type) {
              case 'vuexok:action:resolve':
                removeListener()
                resolve(data.result)
                break;
              case 'vuexok:action:reject':
                removeListener()
                reject(new Error(data.errorMessage))
                break;
            }
          }

          ctx.addEventListener(
            'message',
            callbackListener,
          )

          const eventData:VuexokActionCallEvent = {
            type: 'vuexok:action',
            path,
            action,
            payload,
            vuexokCallbackId,
          }

          ctx.postMessage(eventData)
        })
      },
    },
  )
}
